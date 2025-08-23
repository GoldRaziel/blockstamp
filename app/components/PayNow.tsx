"use client";

import { useState } from "react";

export default function PayNow() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>("");

  async function start() {
    try {
      setBusy(true);
      setErr("");
      // anti-cache: querystring + no-store
      const res = await fetch(`/api/create-checkout-session?ts=${Date.now()}`, {
        method: "POST",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (!data?.url) throw new Error("URL checkout non ricevuto");
      console.log("Stripe checkout URL:", data.url, "priceId:", data.priceId || "(n/d)");
      window.location.href = data.url;
    } catch (e: any) {
      console.error(e);
      setErr(e.message || "Errore avvio checkout");
      setBusy(false);
      alert("Errore avvio checkout");
    }
  }

  return (
    <button
      type="button"
      onClick={start}
      className="mt-6 w-fit px-6 py-3 rounded-lg bg-amber-400 text-black font-semibold shadow hover:bg-amber-300 disabled:opacity-50"
      disabled={busy}
      aria-disabled={busy}
    >
      {busy ? "Reindirizzamento..." : "PAGA ORA"}
    </button>
  );
}
