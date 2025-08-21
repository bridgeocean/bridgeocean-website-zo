import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NaijaRescuePanel from "@/components/NaijaRescuePanel";

export default function NaijaRescuePage() {
  // Render-time timestamp only (does not affect data)
  const updatedAt = new Date().toLocaleString("en-GB");

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Branded header / hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-rose-50 via-amber-50 to-emerald-50 dark:from-rose-950/30 dark:via-amber-950/20 dark:to-emerald-950/20 p-5 md:p-6 shadow-sm">
        {/* Soft background decoration */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-rose-300/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl"
        />

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/naijarescue-logo.png"
              alt="NaijaRescue logo"
              width={40}
              height={40}
              priority
              className="rounded-md border bg-white p-1 object-contain"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                NaijaRescue — Live Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Live Ops · Lagos · Nigeria
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* This just re-requests the page; no data changes */}
            <Link href={`/nexus/naijarescue?ts=${Date.now()}`}>
              <Button variant="outline">Refresh</Button>
            </Link>
          </div>
        </div>

        {/* Cosmetic toolbar (non-functional chips) */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs font-medium shadow-sm dark:bg-zinc-900">
              Live
            </span>
            <span className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs text-muted-foreground dark:bg-zinc-900">
              Last 7 days
            </span>
            <span className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs text-muted-foreground dark:bg-zinc-900">
              Lagos Region
            </span>

            <span className="ml-auto text-xs text-muted-foreground">
              Updated {updatedAt}
            </span>
        </div>
      </section>

      {/* Your existing data panel — unchanged */}
      <NaijaRescuePanel />
    </main>
  );
}
