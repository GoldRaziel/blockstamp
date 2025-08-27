"use client";

import { useState } from "react";

export default function VerifyBox() {
  const [otsFile, setOtsFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [msgType, setMsgType] = useState<"ok" | "warn" | "error" | "">("");
  const [blockHeight, setBlockHeight] = useState<number | null>(null);

  function pickFile() {
    document.getElementById("otsPicker-it")?.click();
  }

  async function handleVerify() {
    if (!otsFile || busy) return;
    setBusy(true);
    setMsg("");
    setMsgType("");
    setBlockHeight(null);

    try {
      const fd = new FormData();
      fd.append("ots", otsFile);

      const res = await fetch("/api/verify-ots", { method: "POST", body: fd });
      const txt = await res.text();

      let data: any = {};
      try { data = JSON.parse(txt); } catch { data = { raw: txt }; }

      if (!res.ok) {
        const raw = (data?.error || data?.raw || "").toString().toLowerCase();

        if (res.status === 404 || raw.includes("not found")) {
          setMsg("codice inesistente");
          setMsgType("warn");
          return;
        }

        setMsg("attendi 48-72 ore prima di verificare");
        setMsgType("warn");
        return;
      }

      const h = Number(
        data?.block_height ?? data?.blockHeight ?? data?.result?.block_height
      );
      if (Number.isFinite(h)) {
        setBlockHeight(h);
        setMsg("Verifica completata.");
        setMsgType("ok");
      } else {
        setMsg("codice inesistente");
        setMsgType("warn");
      }
    } catch {
      setMsg("attendi 48-72 ore prima di verificare");
      setMsgType("warn");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      id="verifica-it"
      className="mt-10 bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-4"
    >
      <h2 className="text-xl font-semibold text-white">VERIFICA</h2>

      <p className="text-sky-100 text-sm">
        Inserisci qui sotto il tuo file <code>.ots</code> e clicca <strong>VERIFICA</strong>.{" "}
        Otterrai il tuo <strong>numero di blocco</strong> registrato nella blockchain Bitcoin.
      </p>

      <p className="text-sky-100 text-sm">
        <strong>Cosa significa:</strong> la timbratura memorizza l&apos;impronta (SHA-256) del tuo file
        in Bitcoin tramite un percorso di aggiunzione (Merkle). Il <em>Block Height</em> indica il blocco
        che ancora (ancoraggio) la tua prova. Questo fornisce una <strong>prova di esistenza e priorità temporale</strong>:
        dimostra che il tuo contenuto esisteva almeno alla data/ora di quel blocco.{" "}
        <strong>Conservalo: è la tua evidenza tecnica che ti tutela dal punto di vista legale.</strong>
      </p>

      <div className="flex items-center gap-3">
        <input
          id="otsPicker-it"
          type="file"
          accept=".ots"
          className="hidden"
          onChange={(e) => setOtsFile(e.target.files?.[0] ?? null)}
        />

        {/* CARICA FILE = bianco */}
        <button
          type="button"
          onClick={pickFile}
          disabled={busy}
          className="px-4 py-2 rounded-xl font-semibold bg-white hover:bg-neutral-200 text-black disabled:opacity-60 disabled:cursor-not-allowed"
        >
          CARICA FILE
        </button>

        {/* VERIFICA = amber */}
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

      <div className="text-sky-200 text-sm leading-relaxed">
        <strong>Nota:</strong> per una prova completa conserva insieme
        <span className="whitespace-nowrap"> (1) il file originale,</span>
        <span className="whitespace-nowrap"> (2) il suo hash SHA-256</span> e
        <span className="whitespace-nowrap"> (3) il file <code>.ots</code>.</span>
        L’hash collega in modo univoco il file alla timbratura registrata su Bitcoin.
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
              insieme costituiscono la tua evidenza tecnica.
            </p>
          </div>
        )}

        {!busy && msg && (
          <p
            className={
              msgType === "ok"
                ? "text-emerald-300 text-sm"
                : msgType === "warn"
                ? "text-amber-300 text-sm"
                : "text-rose-300 text-sm"
            }
          >
            {msg}
          </p>
        )}
      </div>
    </section>
  );
}
