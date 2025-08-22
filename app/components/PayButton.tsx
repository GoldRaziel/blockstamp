"use client";
import { useState } from "react";

export default function PayButton({ label = "💳 Paga ora" }: { label?: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        if (busy) return;
        setBusy(true);
        try {
          const r = await fetch("/api/checkout", { method: "POST" });
          if (!r.ok) throw new Error("Checkout error");
          const data = await r.json();
          if (!data?.url) throw new Error("Missing checkout URL");
          window.location.assign(data.url);
        } catch (e) {
          console.error(e);
          alert("Errore: impossibile avviare il pagamento.");
          setBusy(false);
        }
      }}
      disabled={busy}
      className={`px-4 py-2 rounded-lg ${busy ? "bg-gray-400 cursor-wait" : "bg-amber-500 hover:bg-amber-400"} disabled:opacity-60`}
    >
      {busy ? "Reindirizzamento..." : label}
    </button>
  );
}
