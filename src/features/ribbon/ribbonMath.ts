import * as THREE from "three";

/** Shape of the film ribbon: a helix that unrolls into a straight strip (u: 0 → 1). */
export const FRAME_W = 1.6;
export const FRAME_H = 0.9;
export const STRIP_H = 1.16;
const GAP = 0.08;
const RADIUS = 3.0;
const TURNS = 1.25;
const PITCH = 1.5;

const UP = new THREE.Vector3(0, 1, 0);

export function lineLength(count: number): number {
  return count * (FRAME_W + GAP);
}

/** Position on the ribbon at t (0..1) when it is u unrolled. */
export function pathAt(t: number, u: number, count: number, out: THREE.Vector3): THREE.Vector3 {
  const theta = Math.PI / 2 + (t - 0.5) * Math.PI * 2 * TURNS;
  const hx = RADIUS * Math.cos(theta);
  const hy = (t - 0.5) * PITCH * TURNS;
  const hz = RADIUS * Math.sin(theta);
  const lx = (0.5 - t) * lineLength(count);
  return out.set(hx + (lx - hx) * u, hy * (1 - u), hz * (1 - u));
}

const a = new THREE.Vector3();
const b = new THREE.Vector3();

/**
 * Right-handed basis (tangent, binormal, normal) at t. The normal faces outward from the helix,
 * and toward +z when the ribbon is flat, so frames always face the camera at the front.
 */
export function basisAt(
  t: number,
  u: number,
  count: number,
  tangent: THREE.Vector3,
  binormal: THREE.Vector3,
  normal: THREE.Vector3,
) {
  const eps = 0.002;
  pathAt(Math.max(0, t - eps), u, count, a);
  pathAt(Math.min(1, t + eps), u, count, b);
  // Reading direction: +x across the front of the helix, so pictures are upright and unmirrored.
  tangent.subVectors(a, b).normalize();
  normal.crossVectors(tangent, UP).normalize();
  binormal.crossVectors(normal, tangent).normalize();
}

const m = new THREE.Matrix4();
const T = new THREE.Vector3();
const B = new THREE.Vector3();
const N = new THREE.Vector3();

/** Place an object at t along the ribbon, facing outward, lifted `lift` off the strip. */
export function placeAt(object: THREE.Object3D, t: number, u: number, count: number, lift = 0.012) {
  pathAt(t, u, count, object.position);
  basisAt(t, u, count, T, B, N);
  object.position.addScaledVector(N, lift);
  m.makeBasis(T, B, N);
  object.quaternion.setFromRotationMatrix(m);
}

const p = new THREE.Vector3();

/**
 * Rebuild the film-base strip as a ribbon mesh along the path. Arrays are reused between calls.
 * UV.x counts frame-lengths along the strip so a painted tile repeats once per frame.
 */
export function updateStrip(geometry: THREE.BufferGeometry, u: number, count: number, samples: number) {
  const vertexCount = (samples + 1) * 2;
  let position = geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
  let normal = geometry.getAttribute("normal") as THREE.BufferAttribute | undefined;
  let uv = geometry.getAttribute("uv") as THREE.BufferAttribute | undefined;

  if (!position || position.count !== vertexCount) {
    position = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
    normal = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
    uv = new THREE.BufferAttribute(new Float32Array(vertexCount * 2), 2);
    geometry.setAttribute("position", position);
    geometry.setAttribute("normal", normal);
    geometry.setAttribute("uv", uv);

    const index: number[] = [];
    for (let i = 0; i < samples; i += 1) {
      const k = i * 2;
      index.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
    }
    geometry.setIndex(index);
  }
  if (!normal || !uv) return;

  // Arc length first, so the painted tile can run in the reading direction (t runs the other way).
  const lengths = new Float32Array(samples + 1);
  const previous = new THREE.Vector3();
  for (let i = 0; i <= samples; i += 1) {
    pathAt(i / samples, u, count, p);
    if (i > 0) lengths[i] = (lengths[i - 1] ?? 0) + p.distanceTo(previous);
    previous.copy(p);
  }
  const length = lengths[samples] ?? 0;

  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples;
    pathAt(t, u, count, p);
    basisAt(t, u, count, T, B, N);
    const k = i * 2;
    position.setXYZ(k, p.x - B.x * (STRIP_H / 2), p.y - B.y * (STRIP_H / 2), p.z - B.z * (STRIP_H / 2));
    position.setXYZ(k + 1, p.x + B.x * (STRIP_H / 2), p.y + B.y * (STRIP_H / 2), p.z + B.z * (STRIP_H / 2));
    normal.setXYZ(k, N.x, N.y, N.z);
    normal.setXYZ(k + 1, N.x, N.y, N.z);
    const s = (length - (lengths[i] ?? 0)) / FRAME_W;
    uv.setXY(k, s, 0);
    uv.setXY(k + 1, s, 1);
  }
  position.needsUpdate = true;
  normal.needsUpdate = true;
  uv.needsUpdate = true;
  geometry.computeBoundingSphere();
  return length;
}

/** Paint one frame-length of film base: dark stock, sprocket holes along both edges, edge marking. */
export function paintFilmBase(): HTMLCanvasElement {
  const width = 512;
  const height = Math.round((width * STRIP_H) / FRAME_W);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#0c1822");
  gradient.addColorStop(0.5, "#08121a");
  gradient.addColorStop(1, "#0c1822");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#02060a";
  const holeW = 30;
  const holeH = 20;
  const topY = 16;
  const bottomY = height - 16 - holeH;
  for (let x = 16; x < width; x += 64) {
    ctx.beginPath();
    ctx.roundRect(x, topY, holeW, holeH, 5);
    ctx.roundRect(x, bottomY, holeW, holeH, 5);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(31, 181, 221, 0.55)";
  ctx.font = "500 15px ui-monospace, Menlo, monospace";
  ctx.textBaseline = "middle";
  ctx.fillText("▶ SAI  MONTAGE MOTION", 22, height - 52);
  ctx.fillStyle = "rgba(233, 241, 245, 0.28)";
  ctx.fillText("24 FPS", width - 92, 52);
  return canvas;
}
