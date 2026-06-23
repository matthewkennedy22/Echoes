import { NextResponse } from "next/server";
import { answerQuestion, warmIndex } from "@/lib/rag";
import type { ChatMessage } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

/** GET /api/chat — pre-build the embedding index so the first chat is fast. */
export async function GET() {
  try {
    const status = await warmIndex();
    return NextResponse.json({ ok: true, ...status });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected server error.";
    const isKeyError = message.includes("OPENAI_API_KEY");
    return NextResponse.json(
      {
        ok: false,
        error: isKeyError
          ? "Add OPENAI_API_KEY to .env.local and restart, then reload this page."
          : message,
      },
      { status: isKeyError ? 503 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Request must include a non-empty 'messages' array." },
        { status: 400 }
      );
    }

    const history: ChatMessage[] = messages
      .filter(
        (m: unknown): m is ChatMessage =>
          !!m &&
          typeof (m as ChatMessage).content === "string" &&
          ((m as ChatMessage).role === "user" ||
            (m as ChatMessage).role === "assistant")
      )
      .map((m: ChatMessage) => ({ role: m.role, content: m.content }));

    const result = await answerQuestion(history);
    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected server error.";
    const isKeyError = message.includes("OPENAI_API_KEY");
    return NextResponse.json(
      {
        error: isKeyError
          ? "The server has no OpenAI API key configured. Add OPENAI_API_KEY to .env.local and restart."
          : message,
      },
      { status: isKeyError ? 503 : 500 }
    );
  }
}
