import { ttsStream } from "@/lib/llm";
import { ttsOptionsForPersona } from "@/lib/personaTts";
import { createTtsPlayToken } from "@/lib/ttsToken";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const { text, format, persona } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'text'." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const personaSlug =
      typeof persona === "string" && persona.trim() ? persona.trim() : undefined;
    const ttsOptions = ttsOptionsForPersona(personaSlug);

    // Fast path for Safari/iOS: return a play URL immediately so the browser
    // can stream audio progressively via a plain <audio src> request.
    if (format === "url") {
      const token = createTtsPlayToken(text, personaSlug);
      return new Response(JSON.stringify({ url: `/api/tts/play?token=${token}` }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const stream = await ttsStream(text, ttsOptions);
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
