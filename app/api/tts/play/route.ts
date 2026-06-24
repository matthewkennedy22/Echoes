import { ttsStream } from "@/lib/llm";
import { verifyTtsPlayToken } from "@/lib/ttsToken";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing token." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const text = verifyTtsPlayToken(token);
  if (!text) {
    return new Response(JSON.stringify({ error: "Invalid or expired token." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
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
