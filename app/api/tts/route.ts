import { ttsStream } from "@/lib/llm";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'text'." }), {
        status: 400,
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
