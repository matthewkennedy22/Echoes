import fs from "node:fs";
import path from "node:path";
import { getActivePersona } from "@/lib/activePersona";
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

const availableBySlug = new Map<string, ImageAsset[]>();

/** Library images for a persona whose files are present in /public. */
export function availableImagesForPersona(slug: string, images: ImageAsset[]): ImageAsset[] {
  const cached = availableBySlug.get(slug);
  if (cached) return cached;

  const available: ImageAsset[] = [];
  const missing: string[] = [];

  for (const img of images) {
    if (isServeableImage(img)) {
      available.push(img);
    } else {
      missing.push(img.src);
    }
  }

  if (missing.length > 0) {
    console.warn(
      `[ECHOES] ${missing.length} catalogued image(s) missing for ${slug} — run npm run fetch-images:\n  ${missing.join("\n  ")}`
    );
  }

  availableBySlug.set(slug, available);
  return available;
}

/** Images for the currently active persona. */
export function getAvailableLibraryImages(): ImageAsset[] {
  const pack = getActivePersona();
  return availableImagesForPersona(pack.public.slug, pack.images);
}

/**
 * @deprecated Prefer getAvailableLibraryImages() — kept for Myron-era call sites.
 */
export const availableMyronAngelImages: ImageAsset[] = [];
