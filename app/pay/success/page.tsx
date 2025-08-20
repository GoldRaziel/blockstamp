"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PaySuccess() {
  const sp = useSearchParams();
  useEffect(() => {
    const sid = sp.get("session_id");
    if (sid) {
      fetch(`/api/stripe/confirm?session_id=${encodeURIComponent(sid)}`)
        .then(() => { window.location.href = "/#upload"; })
        .catch(() => { window.location.href = "/#pricing"; });
    } else {
      window.location.href = "/#pricing";
    }
  }, []);
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">Conferma pagamento…</h1>
      <p className="opacity-80">Attendere qualche secondo…</p>
    </main>
  );
}
