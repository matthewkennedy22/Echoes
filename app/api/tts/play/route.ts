import { ttsStream } from "@/lib/llm";
import { ttsOptionsForPersona } from "@/lib/personaTts";
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

  const verified = verifyTtsPlayToken(token);
  if (!verified) {
    return new Response(JSON.stringify({ error: "Invalid or expired token." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const stream = await ttsStream(
      verified.text,
      ttsOptionsForPersona(verified.persona)
    );
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
