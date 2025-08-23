"use client";

import { useRef, useState, useEffect } from "react";

export default function PortalPage() {
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [receiptCode, setReceiptCode] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Stabilizzatore: se arrivo con ?session_id, setto il cookie e ripulisco l'URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const sid = sp.get("session_id");
    if (sid) {
      fetch(`/api/confirm?session_id=${encodeURIComponent(sid)}`, { cache: "no-store" })
        .finally(() => history.replaceState({}, "", "/portal"));
    }
  }, []);

  async function handleStamp() {
    setError("");
    setReceiptCode("");

    if (!zipFile) { setError("Seleziona prima il file .zip."); return; }
    if (!zipFile.name.toLowerCase().endsWith(".zip")) { setError("È consentito solo il caricamento di file .zip."); return; }

    try {
      setBusy(true);
      const fd = new FormData();
      fd.append("zip", zipFile);

      const res = await fetch("/api/stamp", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const code = res.headers.get("x-receipt-code") || "";
      setReceiptCode(code);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "blockstamp_receipt.ots";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Errore imprevisto.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto pt-6 pb-24">
      {/* Logo alto a sinistra, NON cliccabile */}
      <div className="mb-6">
        <img src="/logo.png" width="1000" height="500" alt="Blockstamp" className="h-auto max-h-14 md:max-h-20 w-auto origin-left md:scale-100 scale-[1.15] select-none pointer-events-none" />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-sky-100 mb-6">Area riservata: Carica .zip e TIMBRA</h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <p className="text-sky-100"><strong>ISTRUZIONI:</strong> Crea un file <strong>.zip</strong> con :</p>
        <ul className="list-disc list-inside text-sky-100">
          <li>Il tuo <strong>file originale</strong> (o cartella) da proteggere</li>
          <li>Il <strong>file di testo (.txt)</strong> con il <span className="text-sky-300">codice SHA-256</span> che hai generato sul nostro sito</li>
          <li>Carica qui sotto il file <strong>.zip</strong> creato</li>
                  <li>Otterrai un <strong>codice .ots</strong>: è la prova di avvenuta registrazione;</li>
          <li>Conserva il <strong>codice .ots</strong> assieme al tuo <strong>file .zip</strong>;</li>
          <li>Tra <strong>48–72 ore</strong> inserisci il tuo <strong>codice .ots</strong> sulla nostra Home, sezione <strong>VERIFICA</strong>;</li>
          <li>Riceverai il tuo <strong>numero di blocco</strong> nella blockchain Bitcoin;</li>
          <li>Conservalo: è la tua prova inconfutabile di proprietà intellettuale a quella data.</li>
        </ul>

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
          >
            {busy ? "In corso..." : "TIMBRA in Blockchain"}
          </button>
        </div>

        {error && <div className="mt-2 text-red-300 text-sm">{error}</div>}
      </div>

      <div className="mt-8 bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-3">
        <h2 className="font-semibold text-sky-200">Importante — Conserva la ricevuta</h2>
        <p>Scaricherai un file <strong>.ots</strong>. Conservalo assieme al tuo <strong>.zip</strong>.</p>
        {receiptCode ? (
          <p><strong>Codice ricevuta:</strong> <span className="text-sky-300 break-all">{receiptCode}</span></p>
        ) : null}
        <p className="text-sm opacity-90">
          La conferma on-chain richiede <strong>48–72 ore</strong>. Per conoscere il <strong>Block Height</strong>,
          usa la sezione <strong>VERIFICA</strong> (sotto <strong>PROCEDURA</strong>) inserendo lo <strong>SHA-256</strong> generato in Home.
        </p>
      </div>

      {/* Nascondi navbar/header ereditati */}
      <style jsx global>{`
        header, nav { display: none !important; }
      `}</style>
    </div>
  );
}
