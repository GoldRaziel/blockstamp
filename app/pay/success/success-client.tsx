"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PaySuccessClient() {
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
  }, [sp]);

  return (
    <>
      <h1 className="text-2xl font-semibold">Conferma pagamento…</h1>
      <p className="opacity-80">Attendere qualche secondo…</p>
    </>
  );
}
