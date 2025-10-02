"use client";

import { useRef, useState, useEffect } from "react";

export default function PortalPage() {
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [receiptCode, setReceiptCode] = useState<string>("");
  const [locked, setLocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);  // Stabilizzatore: se arrivo con ?session_id, conferma e pulisci SOLO la query (mantieni locale/percorso)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const sid = sp.get("session_id");
    if (sid) {
      fetch(`/api/confirm?session_id=${encodeURIComponent(sid)}`, { cache: "no-store", credentials: "include" })
        .finally(() => {
          // Mantiene il path/locale correnti (es. /it/portal, /en/portal, /ar/portal) e rimuove solo la query
          history.replaceState({}, "", window.location.pathname);
        });
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

      
      const apiUrl = "/api/stamp";
    const locale = "en";

      const res = await fetch(apiUrl, { headers: { "x-locale": locale }, method: "POST", credentials: "include", body: fd });
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const code = res.headers.get("x-receipt-code") || "";
      setReceiptCode(code);
      setLocked(true);

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "blockstamp_receipt.ots";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (e: any) {
      setError(e.message || "Errore imprevisto.");
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    try {
      if (!receiptCode) return;
      await navigator.clipboard.writeText(receiptCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="beam beam-hero max-w-3xl mx-auto pt-6 pb-24">
      {/* Header strip */}
      <div className="mb-6 flex items-center justify-between">
        {/* Logo non cliccabile */}
        <img
          src="/logo.png"
          width="1000"
          height="500"
          alt="Blockstamp"
          className="h-auto max-h-14 md:max-h-20 w-auto origin-left md:scale-100 scale-[1.15] select-none pointer-events-none"
        />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-sky-100 mb-6">
        Area riservata: Carica .zip e TIMBRA
      </h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="text-sky-100">
<p className="text-sm leading-relaxed space-y-2 mb-1">
    <strong>ISTRUZIONI:</strong>
</p>
<ul className="list-disc list-inside text-sky-100 space-y-1">
  <li>Nel file <strong>.zip</strong> creato in precedenza, inserisci un file di testo <strong>(.txt)</strong> contenente il codice <strong>SHA256</strong> generato nella pagina <strong>Home</strong>.</li>
  <li>Carica qui sotto il file <strong>.zip</strong> appena creato.</li>
  <li>Otterrai un file <strong>.ots</strong> come prova di avvenuta registrazione.</li>
  <li>Salva il file <strong>.ots</strong> dentro alla cartella contenente il file <strong>.zip</strong>.</li>
  <li>Salva in un altro file di testo <strong>(.txt)</strong> il <strong>codice timbro</strong> che si genererà qui sotto ed inseriscilo nella cartella contenente il file <strong>.zip</strong>.</li>
  <li>Tra <strong>48–72 ore</strong>, carica il file <strong>.ots</strong> nella sezione <strong>VERIFY</strong> della nostra pagina Home.</li>
  <li>Riceverai il tuo <strong>numero di blocco</strong> nella blockchain Bitcoin.</li>
  <li>Genera il tuo <strong>certificato di proprietà</strong> e salvalo in modo sicuro.</li>
</ul>
<p className="text-xs opacity-80 mt-2">
  Nota: in <em>VERIFY</em> va caricato il <strong>file .ots</strong>. Il <strong>codice timbro</strong> è un riferimento interno per recuperare la pratica.
</p>
        </div>

        <div className="flex items-start gap-3">
          {/* Input nascosto */}
          <input
            ref={inputRef}
            id="file-it"
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(e) => setZipFile(e.target.files?.[0] || null)}
          />

          {/* Bottone + nome file sotto */}
          <div className="flex flex-col">
            <label
              htmlFor="file-it"
              className="px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-300 text-black font-semibold cursor-pointer"
            >
              SCEGLI FILE
            </label>

            {/* Nome file selezionato */}
            {zipFile && (
              <div className="mt-2 text-sky-200 text-sm">
                {zipFile.name}
              </div>
            )}
          </div>

          {/* Bottone TIMBRA */}
          <button
            onClick={handleStamp}
            disabled={busy || locked}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold disabled:opacity-50"
          >
            {busy ? "In corso..." : "TIMBRA in Blockchain"}
          </button>
        </div>

        {error && <div className="mt-2 text-red-300 text-sm">{error}</div>}
      </div>

      <div className="mt-8 bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-3">
        <h2 className="font-semibold text-sky-200">Il tuo timbro verrà generato qui:</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-sky-300 break-all text-sm bg-black/20 rounded-md px-3 py-2 min-h-[2.5rem]">
              {receiptCode ? receiptCode : "\u2014 in attesa di generazione \u2014"}
            </div>
          </div>
          <button
            onClick={handleCopy}
            disabled={!receiptCode}
            className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold disabled:opacity-50"
          >
            COPIA
          </button>
        </div>
        {copied && <div className="text-xs text-sky-400">Copiato negli appunti \u2705</div>}
      </div>

      {/* Nascondi navbar/header ereditati */}
      <style jsx global>{`
        header, nav { display: none !important; }
      `}</style>
    </div>
  );
}
