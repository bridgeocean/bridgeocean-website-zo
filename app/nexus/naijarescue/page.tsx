import NaijaRescuePanel from "@/components/NaijaRescuePanel";

export default function NaijaRescuePage() {
  // Keep a light container only; no extra header to avoid duplication
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <NaijaRescuePanel />
    </main>
  );
}
