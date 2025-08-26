"use client";

import { useState } from "react";

export default function PayButton({ label = "PAY NOW" }: { label?: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>("");

  async function startCheckout() {
    try {
      setBusy(true);
      setErr("");
      const res = await fetch(`/api/create-checkout-session?ts=${Date.now()}`, { method: "POST", cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (!data?.url) throw new Error("URL checkout non ricevuto");
      window.location.href = data.url;
    } catch (e: any) {
      setErr(e.message || "Errore avvio checkout");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={startCheckout}
        disabled={busy}
        className="px-5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-semibold disabled:opacity-50"
        aria-disabled={busy}
      >
        {busy ? "Reindirizzamento..." : label}
      </button>
      {err && <span className="text-red-300 text-sm">{err}</span>}
    </div>
  );
}
