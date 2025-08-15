export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") ?? "metrics";
  const limit = searchParams.get("limit") ?? "25";
  const base = process.env.NR_API; // server-only
  if (!base) {
    return new Response(JSON.stringify({ error: "Missing NR_API" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const target = `${base}?action=${encodeURIComponent(action)}&limit=${encodeURIComponent(limit)}`;
  const res = await fetch(target, { cache: "no-store" });
  const text = await res.text();

  // If upstream failed, return a small JSON error (no JSON parsing on a "Forbidden" string)
  if (!res.ok) {
    return new Response(
      JSON.stringify({
        error: true,
        status: res.status,
        bodyPreview: text.slice(0, 200),
      }),
      { status: res.status, headers: { "content-type": "application/json" } }
    );
  }

  // Upstream is OK — pass-through JSON as text
  return new Response(text, {
    status: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
