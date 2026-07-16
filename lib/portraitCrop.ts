import type { CSSProperties } from "react";

/** Tighter crop so vignette edges stay outside circular frames. */
export type PortraitCrop = {
  scale: number;
  posX: string;
  posY: string;
};

export const PORTRAIT_CROP: Record<string, PortraitCrop> = {
  "myron-angel": { scale: 1.34, posX: "50%", posY: "20%" },
  "mark-twain": { scale: 1.18, posX: "50%", posY: "18%" },
  "hubert-howe-bancroft": { scale: 1.26, posX: "50%", posY: "22%" },
  "alonzo-horton": { scale: 1.38, posX: "50%", posY: "20%" },
  "jesse-d-mason": { scale: 1.08, posX: "50%", posY: "42%" },
  "august-hemme": { scale: 1.22, posX: "38%", posY: "32%" },
  "anita-loos": { scale: 1.48, posX: "50%", posY: "22%" },
};

/** Landing-page circular thumbnails — tuned separately from hero crops. */
export const LANDING_PORTRAIT_CROP: Record<string, PortraitCrop> = {
  "anita-loos": { scale: 1.28, posX: "50%", posY: "36%" },
  "august-hemme": { scale: 1.18, posX: "42%", posY: "34%" },
  "jesse-d-mason": { scale: 1.05, posX: "50%", posY: "45%" },
};

export const DEFAULT_PORTRAIT_CROP: PortraitCrop = {
  scale: 1.18,
  posX: "50%",
  posY: "20%",
};

export function portraitCropStyle(
  slug: string,
  variant: "default" | "landing" = "default"
): CSSProperties {
  const crop =
    variant === "landing"
      ? (LANDING_PORTRAIT_CROP[slug] ?? PORTRAIT_CROP[slug] ?? DEFAULT_PORTRAIT_CROP)
      : (PORTRAIT_CROP[slug] ?? DEFAULT_PORTRAIT_CROP);
  return {
    "--portrait-scale": crop.scale,
    "--portrait-pos-x": crop.posX,
    "--portrait-pos-y": crop.posY,
  } as CSSProperties;
}
