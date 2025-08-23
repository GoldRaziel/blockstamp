"use client";

import { useRef, useState } from "react";

export default function PortalPage() {
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [receiptCode, setReceiptCode] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleStamp() {
    setError("");
    setReceiptCode("");

    if (!zipFile) {
      setError("Seleziona prima il file .zip.");
      return;
    }
    if (!zipFile.name.toLowerCase().endsWith(".zip")) {
      setError("È consentito solo il caricamento di file .zip.");
      return;
    }

    try {
      setBusy(true);
      const fd = new FormData();
      fd.append("zip", zipFile);

      const res = await fetch("/api/stamp", { method: "POST", body: fd });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Errore nella timbratura.");
      }

      // Il backend invierà il .ots come blob + header 'x-receipt-code'
      const blob = await res.blob();
      const code = res.headers.get("x-receipt-code") || "";
      setReceiptCode(code);

      // Download automatico della ricevuta .ots
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "blockstamp_receipt.ots";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Errore imprevisto.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto pt-12 pb-24">
      <h1 className="text-2xl md:text-3xl font-bold text-sky-100 mb-6">
        Area riservata: Carica .zip e TIMBRA
      </h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <p className="text-sky-100">
          <strong>Procedura:</strong> nella Home hai generato il <span className="text-sky-300">codice SHA‑256</span> del tuo file.
          Ora crea un <strong>file .zip</strong> che contenga:
        </p>
        <ul className="list-disc list-inside text-sky-100">
          <li>Il tuo <strong>file originale</strong> (o pacchetto di file)</li>
          <li>Un <strong>file di testo</strong> con dentro il <span className="text-sky-300">codice SHA‑256</span> generato</li>
        </ul>
        <p className="text-sky-100">
          Carica qui sotto il .zip e premi <strong>TIMBRA</strong> per avviare la timbratura su Bitcoin.
        </p>

        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept=".zip"
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 text-sky-100"
            onChange={(e) => setZipFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={handleStamp}
            disabled={busy}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold disabled:opacity-50"
            aria-disabled={busy}
          >
            {busy ? "In corso..." : "TIMBRA in Blockchain"}
          </button>
        </div>

        {error && <div className="mt-2 text-red-300 text-sm">{error}</div>}
      </div>

      <div className="mt-8 bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-3">
        <h2 className="font-semibold text-sky-200">Importante — Conserva la ricevuta</h2>
        <p>
          Al termine della timbratura scaricherai un file <strong>.ots</strong> (la ricevuta).
          Conservala assieme al tuo <strong>.zip</strong>.
        </p>
        {receiptCode ? (
          <p>
            <strong>Codice ricevuta:</strong>{" "}
            <span className="text-sky-300 break-all">{receiptCode}</span>
          </p>
        ) : null}
        <p className="text-sm opacity-90">
          La conferma on‑chain richiede in media <strong>48–72 ore</strong>.
          Per verificare il blocco Bitcoin registrato: vai alla sezione <strong>VERIFICA</strong>
          (sotto <strong>PROCEDURA</strong>) e inserisci il <strong>codice SHA‑256</strong>
          del tuo file (quello generato nella Home). Il sistema ti restituirà il <strong>Block Height</strong> da conservare.
        </p>
      </div>
    </div>
  );
}
