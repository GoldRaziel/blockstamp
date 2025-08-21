"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const sid = searchParams?.session_id;
    if (!sid) return;
    (async () => {
      try {
        const res = await fetch("/api/mark-paid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sid }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Errore di conferma pagamento");
        setOk(true);
      } catch (e: any) {
        setErr(e?.message || "Errore");
      }
    })();
  }, [searchParams?.session_id]);

  return (
    <div className="max-w-xl mx-auto text-center space-y-4 mt-16">
      <h1 className="text-3xl font-semibold">Pagamento</h1>
      {ok ? (
        <>
          <p className="text-green-400">✅ Pagamento confermato. Il servizio è sbloccato.</p>
          <Link href="/#upload" className="underline">Torna a TIMBRA</Link>
        </>
      ) : err ? (
        <>
          <p className="text-red-400">❌ {err}</p>
          <Link href="/#upload" className="underline">Torna indietro</Link>
        </>
      ) : (
        <p>Verifica in corso…</p>
      )}
    </div>
  );
}
