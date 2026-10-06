"use client";

import { PerformanceMonitor, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { cursorStore } from "@/components/motion/cursorStore";
import { FRAME_H, FRAME_W, paintFilmBase, placeAt, updateStrip } from "./ribbonMath";
import { ribbonStore } from "./ribbonStore";

export type RibbonFrame = { src: string; width: number; height: number; label: string };

type FilmRibbonProps = {
  frames: RibbonFrame[];
  /** Pause rendering when the hero is off-screen. */
  active: boolean;
  onSelect?: (index: number) => void;
  /** Called when frame rate stays low: the stage drops to the CSS version. */
  onFallback?: () => void;
};

const SAMPLES = 360;
const smooth = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

function Scene({ frames, onSelect }: Pick<FilmRibbonProps, "frames" | "onSelect">) {
  const count = frames.length;
  const textures = useTexture(frames.map((frame) => frame.src));
  const base = useMemo(() => {
    const texture = new THREE.CanvasTexture(paintFilmBase());
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.anisotropy = 8;
    return texture;
  }, []);
  const geometry = useMemo(() => new THREE.BufferGeometry(), []);
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<Array<THREE.Mesh | null>>([]);
  const hovered = useRef(-1);
  const unroll = useRef(0);
  const scales = useRef<number[]>(Array.from({ length: count }, () => 1));
  const { camera, pointer, size } = useThree();

  // Cover-crop every picture to 16:9 and mark it as sRGB.
  useEffect(() => {
    textures.forEach((texture, i) => {
      const frame = frames[i];
      if (!frame) return;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      const aspect = frame.width / frame.height;
      const target = FRAME_W / FRAME_H;
      if (aspect > target) {
        texture.repeat.set(target / aspect, 1);
        texture.offset.set((1 - target / aspect) / 2, 0);
      } else {
        texture.repeat.set(1, aspect / target);
        texture.offset.set(0, (1 - aspect / target) / 2);
      }
      texture.needsUpdate = true;
    });
  }, [textures, frames]);

  useEffect(
    () => () => {
      geometry.dispose();
      base.dispose();
      cursorStore.set("default");
    },
    [geometry, base],
  );

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const progress = ribbonStore.progress;
    const eased = smooth(0, 1, progress);
    unroll.current += (smooth(0.38, 0.98, progress) - unroll.current) * (1 - Math.exp(-6 * delta));
    const u = unroll.current;

    // Camera: dolly in as the hero scrolls away.
    const persp = camera as THREE.PerspectiveCamera;
    const wide = size.width / size.height;
    persp.position.set(0, THREE.MathUtils.lerp(0.35, 0, eased), THREE.MathUtils.lerp(wide < 0.9 ? 15 : 11.2, wide < 0.9 ? 9 : 4.9, eased));
    persp.lookAt(0, 0, 0);

    const g = group.current;
    if (g) {
      const heroX = wide < 0.9 ? 0 : Math.min(2.5, wide * 1.2);
      const heroY = wide < 0.9 ? 1.4 : 0;
      g.position.x = THREE.MathUtils.lerp(heroX, 0, u) - (progress - 0.5) * 6 * u;
      g.position.y = THREE.MathUtils.lerp(heroY, 0, u);
      g.rotation.y = (1 - u) * (time * 0.12 + pointer.x * 0.35);
      g.rotation.x = -pointer.y * 0.1 * (1 - u * 0.5);
      g.rotation.z = THREE.MathUtils.lerp(-0.06, 0, u);
    }

    updateStrip(geometry, u, count, SAMPLES);
    for (let i = 0; i < count; i += 1) {
      const mesh = meshes.current[i];
      if (!mesh) continue;
      placeAt(mesh, (i + 0.5) / count, u, count);
      const target = hovered.current === i ? 1.07 : 1;
      scales.current[i] = (scales.current[i] ?? 1) + (target - (scales.current[i] ?? 1)) * (1 - Math.exp(-12 * delta));
      mesh.scale.setScalar(scales.current[i] ?? 1);
    }
  });

  const over = (index: number) => (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    hovered.current = index;
    cursorStore.set("play");
  };
  const out = () => {
    hovered.current = -1;
    cursorStore.set("default");
  };

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshStandardMaterial map={base} roughness={0.6} metalness={0.15} side={THREE.DoubleSide} />
      </mesh>
      {frames.map((frame, i) => (
        <mesh
          key={`${frame.src}-${i}`}
          ref={(node) => {
            meshes.current[i] = node;
          }}
          onPointerOver={over(i)}
          onPointerOut={out}
          onClick={() => onSelect?.(i)}
        >
          <planeGeometry args={[FRAME_W, FRAME_H]} />
          <meshBasicMaterial map={textures[i]} toneMapped={false} />
        </mesh>
      ))}
      <ambientLight intensity={0.9} />
      <directionalLight position={[-4, 5, 6]} intensity={1.6} color="#e9f1f5" />
      <pointLight position={[5, -2, -4]} intensity={40} color="#1fb5dd" distance={20} />
    </group>
  );
}

export default function FilmRibbon({ frames, active, onSelect, onFallback }: FilmRibbonProps) {
  const [dpr, setDpr] = useState(1.75);
  const [shown, setShown] = useState(false);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, dpr]}
      camera={{ fov: 32, position: [0, 0.35, 11.2], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      performance={{ min: 0.6 }}
      onCreated={({ gl }) => {
        gl.setClearAlpha(0);
        requestAnimationFrame(() => setShown(true));
      }}
      style={{ opacity: shown ? 1 : 0, transition: "opacity 600ms var(--ease-glide)" }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onFallback={() => onFallback?.()}
        flipflops={3}
      />
      <Suspense fallback={null}>
        <Scene frames={frames} onSelect={onSelect} />
      </Suspense>
    </Canvas>
  );
}
