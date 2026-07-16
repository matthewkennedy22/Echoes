import { judgeJSON } from "@/lib/llm";
import type { EvidenceLabel, SourceChunk } from "@/lib/types";

const EVIDENCE_LABELS: EvidenceLabel[] = [
  "documented",
  "inference",
  "contested",
  "unknown",
];

export type GroundingVerdict = {
  grounded: boolean;
  evidenceLabel: EvidenceLabel;
  supportedSourceIds: string[];
  reason: string;
};

const VERIFIER_SYSTEM = `
You are a strict grounding verifier for ECHOES, a historical persona chatbot.
Your ONLY job is to decide whether an assistant answer is supported by the provided
source passages — not by general world knowledge, Wikipedia, or training data.

Rules:
- "grounded" is true ONLY when every MAIN factual claim in the answer is directly
  supported by at least one source passage below.
- If the answer names a person, office, date, or event that does not appear in the
  sources (or appears only in an unrelated context), grounded is false.
- If sources mention a related topic but not the specific claim (e.g. answer says
  "first mayor" but sources only mention a different mayor), grounded is false.
- Polite framing, offers to continue, and in-character tone do not need sources.
- If grounded is false, evidence_label must be "unknown".
- supported_source_ids must list ALL ids from the passages below that support any
  main fact in the answer (up to 6 ids). Do not list only one when several apply.
  Use [] when grounded is false.
- Be strict: when in doubt, grounded is false.

Respond with JSON only:
{
  "grounded": boolean,
  "evidence_label": "documented" | "inference" | "contested" | "unknown",
  "supported_source_ids": ["id", ...],
  "reason": "one short sentence"
}
`.trim();

function formatSourcesForVerifier(sources: SourceChunk[]): string {
  return sources
    .slice(0, 14)
    .map(
      (s) =>
        `[${s.id}]\n${s.text.slice(0, 900).trim()}${s.text.length > 900 ? "…" : ""}`
    )
    .join("\n\n---\n\n");
}

function parseVerifierVerdict(raw: string): GroundingVerdict {
  const fallback: GroundingVerdict = {
    grounded: false,
    evidenceLabel: "unknown",
    supportedSourceIds: [],
    reason: "Verifier could not confirm grounding.",
  };

  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    const parsed = JSON.parse(
      start >= 0 && end > start ? raw.slice(start, end + 1) : raw
    ) as {
      grounded?: boolean;
      evidence_label?: string;
      supported_source_ids?: unknown;
      reason?: string;
    };

    const evidenceLabel = EVIDENCE_LABELS.includes(
      parsed.evidence_label as EvidenceLabel
    )
      ? (parsed.evidence_label as EvidenceLabel)
      : "unknown";

    const supportedSourceIds = Array.isArray(parsed.supported_source_ids)
      ? parsed.supported_source_ids.filter((id) => typeof id === "string")
      : [];

    const grounded = parsed.grounded === true && supportedSourceIds.length > 0;

    return {
      grounded,
      evidenceLabel: grounded ? evidenceLabel : "unknown",
      supportedSourceIds: grounded ? supportedSourceIds : [],
      reason:
        typeof parsed.reason === "string" && parsed.reason.trim()
          ? parsed.reason.trim()
          : fallback.reason,
    };
  } catch {
    return fallback;
  }
}

/** LLM agent that checks whether an answer is supported by retrieved sources only. */
export async function verifyAnswerGrounding(opts: {
  question: string;
  answer: string;
  claimedLabel: EvidenceLabel;
  sources: SourceChunk[];
  personaName: string;
}): Promise<GroundingVerdict> {
  const { question, answer, claimedLabel, sources, personaName } = opts;

  if (!answer.trim() || sources.length === 0) {
    return {
      grounded: false,
      evidenceLabel: "unknown",
      supportedSourceIds: [],
      reason: "No answer or no sources to verify against.",
    };
  }

  const user = `
Persona: ${personaName}
Visitor question: ${question}

Assistant answer to verify:
${answer}

Claimed evidence label: ${claimedLabel}

SOURCE PASSAGES (the ONLY allowable evidence):
${formatSourcesForVerifier(sources)}
`.trim();

  const raw = await judgeJSON(VERIFIER_SYSTEM, user);
  return parseVerifierVerdict(raw);
}

export function groundingRejectionPrompt(reason: string): string {
  return `
# GROUNDING CHECK FAILED
An independent verifier determined your previous answer used facts NOT supported by
the source passages provided. General historical knowledge is NOT allowed.

Verifier reason: ${reason}

You MUST do ONE of the following:
1. Answer ONLY from the sources above — with an accurate evidence_label and
   used_source_ids listing the passages you actually relied on, OR
2. Use evidence_label "unknown", empty used_source_ids, and admit honestly that
   the sources before you do not address the question.

Do NOT repeat unsupported names, dates, or claims.
`.trim();
}

export function groundingVerifyEnabled(): boolean {
  return process.env.ECHOES_GROUNDING_VERIFY !== "0";
}

export function groundingRetryEnabled(): boolean {
  return process.env.ECHOES_GROUNDING_RETRY !== "0";
}
