export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") ?? "metrics";
  const limit = searchParams.get("limit") ?? "25";
  const base = process.env.NR_API; // server-only env
  if (!base) {
    return new Response(JSON.stringify({ error: "Missing NR_API" }), { status: 500 });
  }

  const target = `${base}?action=${encodeURIComponent(action)}&limit=${encodeURIComponent(limit)}`;
  const res = await fetch(target, { cache: "no-store" });
  const text = await res.text();

  return new Response(text, {
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
    status: res.status,
  });
}

