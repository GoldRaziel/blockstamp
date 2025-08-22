"use client";

import { useEffect, useState } from "react";
import PriceBox from "./components/PriceBox";

function toHex(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showPayNotice, setShowPayNotice] = useState(false);
  const [error, setError] = useState<string>("");
  const [serverHash, setServerHash] = useState<string>("");
  const [paid, setPaid] = useState(false);

  // Verifica stato pagamento
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch("/api/session", { cache: "no-store", credentials: "include" });
        const d = r.ok ? await r.json() : { paid: false };
        if (mounted) setPaid(!!d.paid);
      } catch {
        if (mounted) setPaid(false);
      } finally {
        if (mounted) setChecked(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function handleFile(f: File | null) {
    setFile(f);
    setServerHash("");
    setError("");
    if (!f) { setHash(""); return; }
    const buf = await f.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buf);
    setHash(toHex(digest));
  }

  async function copyHash() {
    if (!hash) return;
    try { await navigator.clipboard.writeText(hash); } catch {}
  }

  async function startPayment() {
    setError("");
    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 20000, currency: "aed", description: "Blockstamp Protection" }),
      });
      const json = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error(json.error || "Errore pagamento");
      if (json.url) window.location.href = json.url;
    } catch (err: any) {
      setError(err?.message || "Errore durante il pagamento.");
    }
  }

  const submitToServer = async () => {
    if (!hash || !file) return;
    if (!paid) { setShowPayNotice(true); return; }

    setBusy(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/submit", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "X-Paid": "1" },
        body: formData,
      });
      const json = await res.json().catch(() => ({} as any));
      if (res.status === 402) {
        setShowPayNotice(true);
        throw new Error(json.error || "Pagamento richiesto");
      }
      if (!res.ok) throw new Error(json.error || "Errore durante l'invio.");
      setServerHash(json.hash || "");
    } catch (e: any) {
      setError(e?.message || "Errore durante l'invio al server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="hero text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          BLOCKSTAMP — Proof of Existence
        </h1>
        <p className="opacity-80 max-w-2xl mx-auto">
          Il modo più sicuro e veloce per registrare su blockchain l&apos;esistenza delle tue idee.
        </p>
      </section>

      {/* STAMP and VERIFY */}
      <section id="upload" className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold tracking-wide mb-4 text-center">STAMP and VERIFY</h2>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Colonna SINISTRA: PREZZO + PAGAMENTO */}
          <div className="space-y-3">
            <PriceBox onPay={startPayment} />
            {checked && paid && (
              <p className="text-sm text-green-400 font-medium">✅ Pagamento effettuato, TIMBRA attivo</p>
            )}
          </div>

          {/* Colonna DESTRA: INPUT SOPRA, IMPRONTA SOTTO */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm opacity-80">Seleziona file</label>
              <input
                type="file"
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                           file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                onChange={(e) => handleFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm opacity-80">Impronta del file (SHA-256)</label>
              <textarea
                className="w-full h-32 rounded-lg bg-black/40 border border-white/10 p-3 text-sm font-mono"
                readOnly
                value={hash}
                placeholder="L'impronta verrà mostrata qui…"
              />
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copyHash}
                  disabled={!hash || busy}
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40"
                >
                  Copia impronta
                </button>
                <button
                  onClick={submitToServer}
                  disabled={!hash || !file || busy}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40"
                >
                  ✅ Timbra ora
                </button>
              </div>
              {serverHash && (
                <p className="text-xs mt-1 text-green-400">
                  ✅ Hash ricevuto dal server: <code className="break-all">{serverHash}</code>
                </p>
              )}
              <p className="text-xs opacity-70">
                Il calcolo avviene nel tuo browser. Il file non lascia mai il tuo dispositivo.
              </p>
              {showPayNotice && !paid && (
                <p className="text-xs mt-2 text-yellow-500">
                  Effettua il pagamento per attivare TIMBRA.
                </p>
              )}
              {error && (
                <p className="text-xs mt-2 text-red-400">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sezioni informative sintetiche */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold">Cosa ottieni</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-sm opacity-70 mb-2">Prova di esistenza</div>
            <p className="text-sm opacity-90">Riferimento pubblico su blockchain per dimostrare priorità temporale.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-sm opacity-70 mb-2">Privacy by design</div>
            <p className="text-sm opacity-90">Il file resta sul tuo dispositivo: carichi solo l&apos;impronta.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-sm opacity-70 mb-2">Documento di prova</div>
            <p className="text-sm opacity-90">Ricevi istruzioni e file .ots per verifiche future.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
