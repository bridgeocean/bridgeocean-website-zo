export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") ?? "metrics";
  const limit = searchParams.get("limit") ?? "25";
  const base = process.env.NEXT_PUBLIC_NR_API;
  if (!base) return new Response(JSON.stringify({ error: "Missing NEXT_PUBLIC_NR_API" }), { status: 500 });

  const target = `${base}?action=${encodeURIComponent(action)}&limit=${encodeURIComponent(limit)}`;
  const res = await fetch(target, { cache: "no-store" });
  const text = await res.text(); // pass-through JSON as-is
  return new Response(text, {
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-proxy-target": target,
    },
    status: res.status,
  });
}
