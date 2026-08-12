/**
 * Visitor-facing answer cleanup. Shared by the chat API (before send) and the
 * client renderer (last-resort). Keep emphasis short: names, titles, a word
 * of stress — never whole sentences or paragraphs.
 */
export const MAX_INLINE_EMPHASIS = 48;

/**
 * Models wrap whole paragraphs in *italics* / _underscores_ / **bold**.
 * Keep short emphasis; unwrap paragraph-scale wrapping.
 */
export function unwrapParagraphEmphasis(answer: string): string {
  return answer
    .split(/\n\n+/)
    .map((block) => {
      const t = block.trim();
      if (t.length <= 40) return block;
      if (
        t.startsWith("**") &&
        t.endsWith("**") &&
        !t.slice(2, -2).includes("**")
      ) {
        return t.slice(2, -2);
      }
      if (
        t.startsWith("*") &&
        t.endsWith("*") &&
        !t.startsWith("**") &&
        !t.slice(1, -1).includes("*")
      ) {
        return t.slice(1, -1);
      }
      if (
        t.startsWith("_") &&
        t.endsWith("_") &&
        !t.slice(1, -1).includes("_")
      ) {
        return t.slice(1, -1);
      }
      return block;
    })
    .join("\n\n");
}

/**
 * Drop **bold** / *italic* / _italic_ markers when the span is longer than
 * a short name or title. Matches FormattedText in Chat.tsx so the API payload
 * and the bubble agree.
 */
export function unwrapLongInlineEmphasis(answer: string): string {
  return answer
    .replace(/\*\*([^*]+)\*\*/g, (_, inner: string) =>
      inner.length > MAX_INLINE_EMPHASIS ? inner : `**${inner}**`
    )
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, (full, prefix: string, inner: string) =>
      inner.length > MAX_INLINE_EMPHASIS ? `${prefix}${inner}` : full
    )
    .replace(/_([^_\n]+)_/g, (full, inner: string) =>
      inner.length > MAX_INLINE_EMPHASIS ? inner : full
    );
}

/** Strip markdown/HTML image embeds and collapse gap-making whitespace. */
export function sanitizeAnswerText(answer: string): string {
  return unwrapLongInlineEmphasis(
    unwrapParagraphEmphasis(
      answer
        .replace(/!\[[^\]]*\](?:\([^)]*\))?/g, "")
        .replace(/<img\b[^>]*>/gi, "")
        .replace(
          /^\s*https?:\/\/(?:upload\.)?wikimedia\.org\/[^\s]+\s*$/gim,
          ""
        )
        .replace(
          /^\s*https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^\s]*)?\s*$/gim,
          ""
        )
        .replace(/[^\S\n]+/g, " ")
        .replace(/ ?\n ?/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
    )
  );
}
