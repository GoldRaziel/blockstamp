"use client";

import { useState } from "react";

export default function VerifyBox() {
  const [otsFile, setOtsFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [blockHeight, setBlockHeight] = useState<number | null>(null);

  async function handleVerify() {
    if (!otsFile) return;
    setBusy(true);
    setMsg("");
    setBlockHeight(null);
    try {
      const fd = new FormData();
      fd.append("ots", otsFile);

      const res = await fetch("/api/verify-ots", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Errore di rete");
      }
      const data = await res.json();

      // ci aspettiamo es. { ok: true, block_height: 861234 } oppure struttura simile
      const h = Number(data?.block_height ?? data?.blockHeight ?? data?.result?.block_height);
      if (Number.isFinite(h)) {
        setBlockHeight(h);
        setMsg("Verifica completata.");
      } else {
        setMsg("Non sono riuscito a leggere un Block Height valido dalla risposta.");
      }
    } catch (e: any) {
      setMsg(e?.message || "Verifica fallita.");
    } finally {
      setBusy(false);
    }
  }

  function pickFile() {
    document.getElementById("otsPicker")?.click();
  }

  return (
    <section id="verifica" className="mt-10 bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-4">
      <h2 className="text-xl font-semibold text-white">VERIFICA</h2>

      <p className="text-sky-100">
        Inserisci qui sotto il tuo file <code>.ots</code> e clicca <strong>VERIFICA</strong>.
        Otterrai il tuo <strong>numero di blocco</strong> registrato nella blockchain Bitcoin.
      </p>

      <div className="text-sky-100 text-sm space-y-2">
        <p className="opacity-90">
          <strong>Cosa significa:</strong> la timbratura memorizza l&apos;impronta (SHA‑256) del tuo file
          in Bitcoin tramite un percorso di aggiunzione (Merkle). Il <em>Block Height</em> indica il blocco
          che ancora (ancoraggio) la tua prova. Questo fornisce una <strong>prova di esistenza e priorità temporale</strong>:
          dimostra che il tuo contenuto <em>esisteva almeno</em> alla data/ora di quel blocco. Conservalo: è la tua
          evidenza tecnica che ti tutela dal punto di vista legale.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="otsPicker"
          type="file"
          accept=".ots"
          className="hidden"
          onChange={(e) => setOtsFile(e.target.files?.[0] ?? null)}
        />

        <button
          type="button"
          onClick={pickFile}
          disabled={busy}
          className="px-4 py-2 rounded-xl font-semibold bg-amber-400 hover:bg-amber-300 text-black disabled:opacity-60 disabled:cursor-not-allowed"
        >
          CARICA FILE
        </button>

        <button
          type="button"
          onClick={handleVerify}
          disabled={!otsFile || busy}
          className="px-4 py-2 rounded-xl font-semibold bg-amber-400 hover:bg-amber-300 text-black disabled:opacity-60 disabled:cursor-not-allowed"
        >
          VERIFICA
        </button>

        <span className="text-sky-200 text-sm truncate max-w-[50%]">
          {otsFile ? otsFile.name : "Nessun file selezionato"}
        </span>
      </div>

      <div className="min-h-6">
        {busy && <p className="text-sky-200 text-sm">Verifica in corso…</p>}
        {!busy && blockHeight !== null && (
          <div className="text-sky-100">
            <p className="text-sm">Risultato:</p>
            <p className="text-lg font-mono">
              Block Height: <span className="font-bold">{blockHeight}</span>
            </p>
            <p className="text-sky-200 text-sm mt-2">
              Conserva questo numero insieme al tuo file <code>.ots</code> e al documento originale:
              insieme costituiscono la tua prova tecnica.
            </p>
          </div>
        )}
        {!busy && msg && blockHeight === null && (
          <p className="text-rose-300 text-sm">{msg}</p>
        )}
      </div>
    </section>
  );
}
