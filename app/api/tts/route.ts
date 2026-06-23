import { ttsStream } from "@/lib/llm";
import { createTtsPlayToken } from "@/lib/ttsToken";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { text, format } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'text'." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fast path for Safari/iOS: return a play URL immediately so the browser
    // can stream audio progressively via a plain <audio src> request.
    if (format === "url") {
      const token = createTtsPlayToken(text);
      return new Response(JSON.stringify({ url: `/api/tts/play?token=${token}` }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const stream = await ttsStream(text);
    return new Response(stream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected server error.";
    const isKeyError = message.includes("OPENAI_API_KEY");
    return new Response(JSON.stringify({ error: message }), {
      status: isKeyError ? 503 : 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
