"use client";

import React, { useEffect, useState, useRef } from "react";

type SessionResp = { paid: boolean };

function PriceTag() {
  const label = process.env.NEXT_PUBLIC_PRICE_LABEL || "€4.99 / file";
  return (
    <div className="mt-3 rounded-lg border border-sky-300/50 bg-sky-950/20 p-3 text-sky-200">
      <div className="text-xs uppercase tracking-widest text-sky-300">Prezzo</div>
      <div className="mt-1 text-lg font-semibold">{label}</div>
      <div className="mt-1 text-xs opacity-80">
        Paghi una sola volta per attivare la timbratura su blockchain.
      </div>
    </div>
  );
}

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [paid, setPaid] = useState<boolean>(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [okMsg, setOkMsg] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 1) Controllo sessione: no-store + credenziali
  useEffect(() => {
    let stop = false;
    (async () => {
      try {
        const res = await fetch("/api/session", { cache: "no-store", credentials: "include" });
        if (!res.ok) throw new Error("Session check failed");
        const data = (await res.json()) as SessionResp;
        if (!stop) setPaid(!!data.paid);
      } catch {
        if (!stop) setPaid(false);
      }
    })();
    return () => {
      stop = true;
    };
  }, []);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setOkMsg("");
    setFile(e.target.files?.[0] || null);
  };

  // 2) Avvio Stripe Checkout
  const handlePay = async () => {
    try {
      setBusy(true);
      setError("");
      setOkMsg("");

      // opzionale: passa info utili al server (nome file, size)
      const body = file
        ? { filename: file.name, size: file.size }
        : { filename: null, size: null };

      const res = await fetch("/api/stripe/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Stripe error: ${txt || res.status}`);
      }
      const data = await res.json();
      const url = data?.url;
      if (!url || typeof url !== "string") {
        throw new Error("Stripe session: url mancante");
      }
      window.location.href = url; // redirect a Checkout
    } catch (e: any) {
      setError(e?.message || "Errore pagamento");
    } finally {
      setBusy(false);
    }
  };

  // 3) Timbra (richiede cookie pagato)
  const handleStamp = async () => {
    try {
      setBusy(true);
      setError("");
      setOkMsg("");

      if (!file) {
        setError("Seleziona un file prima di timbrare.");
        return;
      }

      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/stamp", { method: "POST", body: fd, credentials: "include" });

      if (res.status === 402) {
        throw new Error('Pagamento richiesto: clicca su “Paga e attiva”.');
      }
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Errore ${res.status}`);
      }

      // se il backend restituisce un blob .ots:
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/octet-stream") || ct.includes("application/ots")) {
        const blob = await res.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = (file.name || "file") + ".ots";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setOkMsg("Timbro creato e scaricato correttamente.");
        return;
      }

      // altrimenti JSON/OK
      const data = await res.json().catch(() => ({}));
      setOkMsg(data?.message || "Timbro creato.");
    } catch (e: any) {
      setError(e?.message || "Errore timbratura");
    } finally {
      setBusy(false);
    }
  };

  const disabled = busy;

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Blockstamp – Timbratura su Bitcoin</h1>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <label className="block text-sm font-medium opacity-90">Carica il file da timbrare</label>
        <input
          ref={inputRef}
          type="file"
          onChange={onSelect}
          className="mt-2 w-full rounded border border-white/10 bg-black/20 p-2"
        />

        {/* PREZZO dentro il riquadro upload */}
        <const label = "200 AED / file";
/>

        <div className="mt-4 flex items-center gap-2">
          {!paid ? (
            <button
              onClick={handlePay}
              disabled={disabled}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-400/50 bg-amber-500/10 px-4 py-2 text-amber-200 hover:bg-amber-500/20 disabled:opacity-50"
              aria-label="Paga e attiva"
            >
              <span role="img" aria-hidden>🔒</span> Paga e attiva
            </button>
          ) : (
            <button
              onClick={handleStamp}
              disabled={disabled || !file}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/50 bg-emerald-500/10 px-4 py-2 text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-50"
              aria-label="Timbra ora"
            >
              <span role="img" aria-hidden>✅</span> Timbra ora
            </button>
          )}

          <button
            onClick={() => {
              if (inputRef.current) inputRef.current.value = "";
              setFile(null);
              setError("");
              setOkMsg("");
            }}
            disabled={disabled}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 disabled:opacity-50"
          >
            Reset
          </button>
        </div>

        {file && (
          <div className="mt-3 text-xs opacity-70">
            Selezionato: <b>{file.name}</b> ({Math.ceil(file.size / 1024)} KB)
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-200">
            {error}
          </div>
        )}
        {okMsg && (
          <div className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">
            {okMsg}
          </div>
        )}
      </div>

      <p className="mt-6 text-xs opacity-70">
        Dopo il pagamento verrai reindirizzato automaticamente alla pagina di ritorno e il servizio sarà attivo
        su questo browser per 24 ore.
      </p>
    </main>
  );
}