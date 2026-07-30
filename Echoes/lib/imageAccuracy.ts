/**
 * Historical accuracy guards for the image library.
 * Prevents showing a visual that depicts the wrong people, place, or era.
 */

/** Images that verifiably depict Chumash subjects or Chumash rock art. */
export const CHUMASH_VERIFIED_IMAGE_IDS = new Set([
  "img-chumash-musicians-1873",
  "img-chumash-painted-cave",
  "img-chumash-pictograph-oakbrook",
]);

/** Museum exhibit photos — traditional Chumash life (post-1905; say so in caption). */
export const CHUMASH_EXHIBIT_IMAGE_IDS = new Set([
  "img-chumash-mortars-exhibit",
  "img-chumash-ap-replica",
]);

/** Chumash plank tomols — illustration or modern documentary photos (not period). */
export const CHUMASH_TOMOL_IMAGE_IDS = new Set([
  "img-chumash-tomol-kihn",
  "img-chumash-tomol-elyewun-2006",
  "img-chumash-tomol-crossing-2015",
]);

export const CHUMASH_APPROVED_IMAGE_IDS = new Set([
  ...CHUMASH_VERIFIED_IMAGE_IDS,
  ...CHUMASH_TOMOL_IMAGE_IDS,
  ...CHUMASH_EXHIBIT_IMAGE_IDS,
]);

/**
 * Louis Choris (1822) engravings from San Francisco Bay — Ohlone / Cholovones,
 * NOT Chumash. Usable for general California indigenous / tule-boat context only.
 */
export const CHORIS_1822_IMAGE_IDS = new Set([
  "img-choris-tule-canoe-1822",
  "img-choris-california-people-1822",
  "img-choris-cholovones-hunting-1822",
]);

/** Legacy ids kept so old sessions do not crash — never offer to the model. */
export const DEPRECATED_IMAGE_IDS = new Set([
  "img-chumash-choris-canoe-1822",
  "img-chumash-choris-people-1822",
  "img-chumash-choris-hunting-1822",
]);

export function storyMentionsChumash(storyHay: string): boolean {
  return /\bchumash\b/i.test(storyHay);
}

export function storyMentionsTomol(storyHay: string): boolean {
  return /\b(?:tomol|tomols|plank canoe|plank-built canoe)\b/i.test(storyHay);
}

/**
 * Returns false when showing this image would misrepresent the story.
 * Call after other relevance checks.
 */
export function isHistoricallyAccurateForStory(
  imageId: string,
  storyHay: string
): boolean {
  if (DEPRECATED_IMAGE_IDS.has(imageId)) return false;

  const chumashStory = storyMentionsChumash(storyHay);
  const tomolStory = storyMentionsTomol(storyHay);

  // Choris ≠ Chumash — never pair with explicit Chumash narratives.
  if (chumashStory && CHORIS_1822_IMAGE_IDS.has(imageId)) return false;

  // Tule-rush boats (Choris) are not plank tomols — do not use for tomol stories.
  if (tomolStory && CHORIS_1822_IMAGE_IDS.has(imageId)) return false;

  // Tomol stories need verified tomol art — not Choris tule boats or unrelated images.
  if (
    tomolStory &&
    chumashStory &&
    !CHUMASH_VERIFIED_IMAGE_IDS.has(imageId) &&
    !CHUMASH_TOMOL_IMAGE_IDS.has(imageId)
  ) {
    return false;
  }

  return true;
}

export const IMAGE_ACCURACY_PROMPT = `
# HISTORICAL ACCURACY (IMAGES — CRITICAL)
- **Chumash-specific stories:** Use img-chumash-musicians-1873, img-chumash-painted-cave,
  img-chumash-pictograph-oakbrook (rock art), img-chumash-mortars-exhibit (acorn grinding —
  modern museum photo), or img-chumash-ap-replica (village dwelling — modern replica).
  Do NOT use any img-choris-* for Chumash — those engravings show Ohlone / Cholovones at
  San Francisco Bay (Louis Choris, 1822), a different people.
- **Tomols** are plank-built wooden canoes — NOT the tule-rush boats in the Choris engravings.
  For tomol questions use img-chumash-tomol-kihn (artist's reconstruction, 1946),
  img-chumash-tomol-elyewun-2006, or img-chumash-tomol-crossing-2015 (modern Chumash
  crossings — post-1905; say so honestly). Never use img-choris-* for tomols.
- **Choris images (img-choris-*):** Only for general California indigenous / tule-boat context
  when you are NOT claiming they are Chumash. Always say they show Bay Area peoples, not
  specifically our local Chumash.
- **Chinese railroad engraving:** Illustrates Central Pacific labor (Sierra Nevada); cite as
  representative of Chinese railroad workers, including those who helped build our Cuesta tunnels.
- Never label an image as showing something its caption does not depict.
`.trim();
