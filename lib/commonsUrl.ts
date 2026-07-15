/**
 * Build a stable Wikimedia Commons image URL.
 * Always encode the filename; prefer Special:FilePath which redirects to the
 * current upload.wikimedia.org hash path.
 */
export function commonsFileUrl(fileName: string): string {
  const cleaned = fileName.replace(/^File:/i, "").trim();
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(cleaned)}`;
}
