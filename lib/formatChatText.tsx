import { Fragment, type ReactNode } from "react";

const BOLD_RE = /\*\*([^*\n]+)\*\*/g;
const ITALIC_RE = /\*([^*\n]+)\*/g;

/** Turn lightweight markdown in chat answers into React nodes (bold + italic). */
export function formatChatText(text: string): ReactNode {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => (
    <Fragment key={lineIdx}>
      {lineIdx > 0 ? "\n" : null}
      {formatInlineInLine(line, lineIdx)}
    </Fragment>
  ));
}

function formatInlineInLine(line: string, lineIdx: number): ReactNode {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  BOLD_RE.lastIndex = 0;
  while ((match = BOLD_RE.exec(line)) !== null) {
    if (match.index > last) {
      nodes.push(...formatItalicsInSegment(line.slice(last, match.index), lineIdx, key));
      key += 1;
    }
    nodes.push(<strong key={`${lineIdx}-${key++}`}>{match[1]}</strong>);
    last = match.index + match[0].length;
  }
  if (last < line.length) {
    nodes.push(...formatItalicsInSegment(line.slice(last), lineIdx, key));
  }
  return nodes.length === 1 ? nodes[0] : nodes;
}

function formatItalicsInSegment(
  segment: string,
  lineIdx: number,
  keyStart: number
): ReactNode[] {
  if (!segment.includes("*")) return segment ? [segment] : [];

  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = keyStart;
  ITALIC_RE.lastIndex = 0;
  while ((match = ITALIC_RE.exec(segment)) !== null) {
    if (match.index > last) nodes.push(segment.slice(last, match.index));
    nodes.push(<em key={`${lineIdx}-${key++}`}>{match[1]}</em>);
    last = match.index + match[0].length;
  }
  if (last < segment.length) nodes.push(segment.slice(last));
  return nodes;
}
