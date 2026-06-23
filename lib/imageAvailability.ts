import fs from "node:fs";
import path from "node:path";
import { myronAngelImages } from "@/personas/myron-angel/images";
import type { ImageAsset } from "@/lib/types";

const PUBLIC_ROOT = path.join(process.cwd(), "public");

/** True for paths served from /public (not external URLs). */
export function isLocalImagePath(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//");
}

/** Whether a local /public file exists and looks like a real image (>512 B). */
export function localImageFileExists(src: string): boolean {
  if (!isLocalImagePath(src)) return true;
  const filePath = path.join(PUBLIC_ROOT, src.replace(/^\//, ""));
  try {
    const st = fs.statSync(filePath);
    return st.isFile() && st.size > 512;
  } catch {
    return false;
  }
}

/** Local files must exist on disk; remote URLs (Commons) are allowed as-is. */
export function isServeableImage(img: ImageAsset): boolean {
  if (!img.src?.trim()) return false;
  if (/^https?:\/\//i.test(img.src)) return true;
  return localImageFileExists(img.src);
}

export function filterServeableImages(images: ImageAsset[]): ImageAsset[] {
  return images.filter(isServeableImage);
}

function buildAvailableLibraryImages(): ImageAsset[] {
  const available: ImageAsset[] = [];
  const missing: string[] = [];

  for (const img of myronAngelImages) {
    if (isServeableImage(img)) {
      available.push(img);
    } else {
      missing.push(img.src);
    }
  }

  if (missing.length > 0) {
    console.warn(
      `[ECHOES] ${missing.length} catalogued image(s) missing on disk — run npm run fetch-images:\n  ${missing.join("\n  ")}`
    );
  }

  return available;
}

/** Library images whose files are present in /public (safe to offer the model). */
export const availableMyronAngelImages: ImageAsset[] =
  buildAvailableLibraryImages();
