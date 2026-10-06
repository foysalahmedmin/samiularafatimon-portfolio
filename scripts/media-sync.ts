/**
 * Makes content/media.ts real: downloads or copies every image into public/media (resized,
 * recompressed), cuts silent hover-preview clips for videos with ffmpeg, and records size and
 * blur placeholders in content/media.manifest.json.
 *
 *   pnpm media:sync                 sync everything that is missing
 *   pnpm media:sync -- --force      redo everything
 *   pnpm media:sync -- --only <id>  redo one entry
 *
 * Needs ffmpeg on the PATH for preview clips.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { content } from "@content/index";
import { mediaList, type MediaManifest } from "@content/schema/media";

const ROOT = process.cwd();
const PUBLIC_MEDIA = path.join(ROOT, "public", "media");
const PREVIEWS = path.join(PUBLIC_MEDIA, "previews");
const MANIFEST_PATH = path.join(ROOT, "content", "media.manifest.json");

const args = process.argv.slice(2);
const force = args.includes("--force");
const onlyIndex = args.indexOf("--only");
const only = onlyIndex >= 0 ? args[onlyIndex + 1] : undefined;

function wants(id: string, target: string): boolean {
  if (only) return only === id;
  return force || !existsSync(target);
}

async function load(item: { origin?: string | undefined; local?: string | undefined }): Promise<Buffer> {
  if (item.local) return readFile(path.join(ROOT, item.local));
  if (!item.origin) throw new Error("no origin or local source");
  const response = await fetch(item.origin);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${item.origin}`);
  return Buffer.from(await response.arrayBuffer());
}

async function writeImage(input: Buffer, target: string, maxWidth: number) {
  const ext = path.extname(target).toLowerCase();
  let pipeline = sharp(input, { failOn: "none" })
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true });
  if (ext === ".jpg") pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
  else if (ext === ".png") pipeline = pipeline.png({ compressionLevel: 9 });
  else pipeline = pipeline.webp({ quality: 82 });
  await pipeline.toFile(target);
}

async function describe(target: string) {
  const meta = await sharp(target).metadata();
  const blur = await sharp(target).resize({ width: 16 }).jpeg({ quality: 40 }).toBuffer();
  const { size } = await stat(target);
  if (!meta.width || !meta.height) throw new Error(`could not read size of ${target}`);
  return {
    width: meta.width,
    height: meta.height,
    blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}`,
    bytes: size,
  };
}

function ffmpegPreview(src: string, startSec: number, height: number, out: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "ffmpeg",
      [
        "-v", "error", "-y",
        "-ss", String(startSec),
        "-t", "4",
        "-i", src,
        "-an",
        "-vf", `scale=-2:${height},fps=24`,
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "29",
        "-movflags", "+faststart",
        out,
      ],
      { stdio: ["ignore", "inherit", "inherit"] },
    );
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`))));
  });
}

async function main() {
  const items = mediaList.parse(content.media);
  const manifest: MediaManifest = { ...(content.mediaManifest as MediaManifest) };
  await mkdir(PREVIEWS, { recursive: true });

  for (const item of items) {
    if (item.kind === "image") {
      const target = path.join(PUBLIC_MEDIA, item.file);
      if (wants(item.id, target)) {
        process.stdout.write(`image  ${item.id} … `);
        await writeImage(await load(item), target, item.maxWidth ?? 1800);
        console.log("written");
      }
      manifest[item.id] = await describe(target);
    } else if (item.kind === "video" && item.preview) {
      const target = path.join(PREVIEWS, item.preview);
      if (wants(item.id, target)) {
        process.stdout.write(`preview ${item.id} … `);
        await ffmpegPreview(item.src, item.previewStartSec ?? 0, item.previewHeight ?? 360, target);
        console.log("written");
      }
    }
  }

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(MANIFEST_PATH, `${JSON.stringify(sorted, null, 2)}\n`);
  console.log(`manifest: ${Object.keys(sorted).length} images`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
