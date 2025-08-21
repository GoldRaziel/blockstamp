"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("Conferma pagamento in corso…");

  useEffect(() => {
    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const sid = url.searchParams.get("session_id");
        if (!sid) {
          setMsg("Sessione non trovata. Reindirizzo…");
          setTimeout(() => router.replace("/"), 600);
          return;
        }

        // Fallback immediato: chiediamo al server di verificare e settare il cookie
        const r = await fetch(`/api/confirm?session_id=${encodeURIComponent(sid)}`, { cache: "no-store" });
        const j = await r.json();

        if (j?.paid) {
          setMsg("Pagamento confermato. Reindirizzo…");
          setTimeout(() => router.replace("/"), 600);
        } else {
          setMsg("Pagamento non confermato, verifico la sessione…");
          // Anche se non è confermato, torniamo in home: /api/session farà fede
          setTimeout(() => router.replace("/"), 1000);
        }
      } catch {
        setTimeout(() => router.replace("/"), 800);
      }
    };
    run();
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-white">Grazie!</h1>
        <p className="opacity-80">{msg}</p>
      </div>
    </div>
  );
}
