"use client";

import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [msg, setMsg] = useState("Conferma pagamento in corso…");

  useEffect(() => {
    const sid = new URLSearchParams(window.location.search).get("session_id");

    if (!sid) {
      setMsg("Sessione non trovata. Torno alla Home…");
      setTimeout(() => (window.location.href = "/"), 800);
      return;
    }

    (async () => {
      try {
        const r = await fetch(`/api/confirm?session_id=${encodeURIComponent(sid)}`, { cache: "no-store" });
        const j = await r.json().catch(() => ({} as any));
        if (j?.paid) {
          setMsg("Pagamento confermato. Reindirizzo…");
        } else {
          setMsg("Pagamento ricevuto. Sto completando…");
        }
      } catch {
        setMsg("Pagamento ricevuto. Reindirizzo…");
      } finally {
        setTimeout(() => (window.location.href = "/"), 900);
      }
    })();
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-white">Grazie!</h1>
        <p className="opacity-80">{msg}</p>
        <p className="text-xs opacity-60">
          Se non vieni reindirizzato, <a className="underline" href="/">torna alla Home</a>.
        </p>
      </div>
    </div>
  );
}
