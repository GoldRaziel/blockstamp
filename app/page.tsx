"use client";

import React, { useEffect, useRef, useState } from "react";

type SessionResp = { paid: boolean };

function PriceBox() {
  return (
    <div className="mt-3 rounded-lg border border-sky-300/50 bg-sky-900/20 p-3 text-sky-100">
      <div className="text-xs uppercase tracking-widest text-sky-300">Prezzo</div>
      <div className="mt-1 text-lg font-semibold">200 AED / file</div>
      <div className="mt-1 text-xs opacity-80">
        Paghi una sola volta per attivare la timbratura su blockchain (valida 24h su questo browser).
      </div>
    </div>
  );
}

export default function Page(): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [paid, setPaid] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [ok, setOk] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Session check (no-store + credentials)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/session", { cache: "no-store", credentials: "include" });
        const data = (await res.json()) as SessionResp;
        if (!cancelled) setPaid(!!data.paid);
      } catch {
        if (!cancelled) setPaid(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
    setError("");
    setOk("");
  };

  async function handlePay() {
    try {
      setBusy(true);
      setError("");
      setOk("");

      const payload = file ? { filename: file.name, size: file.size } : {};
      const res = await fetch("/api/stripe/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text().catch(() => `Stripe ${res.status}`));
      const data = await res.json();
      if (!data?.url) throw new Error("Stripe session URL assente");
      window.location.href = data.url as string;
    } catch (e: any) {
      setError(e?.message || "Errore pagamento");
    } finally {
      setBusy(false);
    }
  }

  async function handleStamp() {
    try {
      setBusy(true);
      setError("");
      setOk("");

      if (!file) {
        setError("Seleziona un file prima di timbrare.");
        return;
      }
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/stamp", { method: "POST", body: fd, credentials: "include" });

      if (res.status === 402) throw new Error('Pagamento richiesto: clicca su “Paga e attiva”.');
      if (!res.ok) throw new Error(await res.text().catch(() => `Errore ${res.status}`));

      // Blob .ots
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/octet-stream") || ct.includes("application/ots")) {
        const blob = await res.blob();
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = (file.name || "file") + ".ots";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setOk("Timbro creato e scaricato.");
        return;
      }

      // JSON fallback
      await res.json().catch(() => ({}));
      setOk("Timbro creato.");
    } catch (e: any) {
      setError(e?.message || "Errore timbratura");
    } finally {
      setBusy(false);
    }
  }

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

        <PriceBox />

        <div className="mt-4 flex items-center gap-2">
          {!paid ? (
            <button
              onClick={handlePay}
              disabled={disabled}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-400/50 bg-amber-500/10 px-4 py-2 text-amber-200 hover:bg-amber-500/20 disabled:opacity-50"
              aria-label="Paga e attiva"
            >
              <span aria-hidden>🔒</span> Paga e attiva
            </button>
          ) : (
            <button
              onClick={handleStamp}
              disabled={disabled || !file}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/50 bg-emerald-500/10 px-4 py-2 text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-50"
              aria-label="Timbra ora"
            >
              <span aria-hidden>✅</span> Timbra ora
            </button>
          )}

          <button
            onClick={() => {
              if (inputRef.current) inputRef.current.value = "";
              setFile(null);
              setError("");
              setOk("");
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
        {ok && (
          <div className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">
            {ok}
          </div>
        )}
      </div>

      <p className="mt-6 text-xs opacity-70">
        Dopo il pagamento verrai reindirizzato e il servizio sarà attivo su questo browser per 24 ore.
      </p>
    </main>
  );
}
