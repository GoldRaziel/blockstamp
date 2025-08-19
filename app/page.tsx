"use client";

import { useState } from "react";

function toHex(buffer: ArrayBuffer) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x: number) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  async function handleFile(f?: File | null) {
    if (!f) return;
    setBusy(true);
    setError("");
    try {
      const buf = await f.arrayBuffer();
      const digest = await crypto.subtle.digest("SHA-256", buf);
      setHash(toHex(digest));
      setFile(f);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Errore durante il calcolo dell'impronta.");
    } finally {
      setBusy(false);
    }
  }

  function downloadRequestJson() {
    if (!hash || !file) return;
    const payload = {
      hash,
      algo: "sha256", // backend: lasciato invariato per compatibilità
      filename: file.name,
      size: file.size,
      timestamp_request: new Date().toISOString(), // backend: campo tecnico, non mostrato in UI
      note: "MVP: invia questo file via email per la marcatura su blockchain."
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blockstamp-request-${file.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyHash() {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
  }

  return (
    <div className="space-y-14">
      {/* HERO centrato */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
          Proteggi la tua idea
          <br />
          <span className="text-sky-400">
            incidila in modo indelebile sulla blockchain di Bitcoin
          </span>
        </h1>
        <p className="text-lg opacity-90 max-w-3xl mx-auto">
          Il modo più sicuro al mondo per registrare e proteggere i tuoi diritti intellettuali.
          Niente burocrazia, niente attese: prova, dimostra, tutela.
        </p>
      </section>

      {/* WIDGET: STAMP and VERIFY */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold tracking-wide mb-4 text-center">STAMP and VERIFY</h2>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Colonna sinistra: selezione file */}
          <div className="space-y-3">
            <label className="block text-sm opacity-80">Seleziona file</label>
            <input
              type="file"
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                         file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
            />
            {busy && <div className="text-sm opacity-80">Calcolo in corso…</div>}
            {error && <div className="text-sm text-red-400">{error}</div>}
            {file && !busy && (
              <div className="text-sm opacity-80">
                <div><b>Nome:</b> {file.name}</div>
                <div><b>Dimensione:</b> {file.size.toLocaleString()} byte</div>
              </div>
            )}
          </div>

          {/* Colonna destra: impronta + azioni */}
          <div className="space-y-3">
            <label className="block text-sm opacity-80">Impronta del file</label>
            <textarea
              className="w-full h-32 rounded-lg bg-black/40 border border-white/10 p-3 text-sm font-mono"
              readOnly
              value={hash}
              placeholder="L'impronta verrà mostrata qui…"
            />
            <div className="flex gap-3">
              <button
                onClick={copyHash}
                disabled={!hash}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40"
              >
                Copia impronta
              </button>
              <button
                onClick={downloadRequestJson}
                disabled={!hash || !file}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40"
              >
                Scarica request.json
              </button>
            </div>
            <p className="text-xs opacity-70">
              Il calcolo avviene nel tuo browser. Il file non lascia mai il tuo dispositivo.
            </p>
          </div>
        </div>
      </section>

      {/* PROCEDURA */}
      <section id="procedura" className="space-y-5">
        <h2 className="text-3xl font-semibold">Procedura</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-sm opacity-70 mb-2">1 · Impronta locale</div>
            <p className="text-sm opacity-90">
              Selezioni il file. Generiamo <b>in locale</b> un’impronta univoca del contenuto. Se cambi anche un solo
              bit, l’impronta cambia.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-sm opacity-70 mb-2">2 · Richiesta di registrazione</div>
            <p className="text-sm opacity-90">
              Crei un <code>request.json</code> con i dati necessari. Con il servizio a pagamento, l’impronta viene
              <b> ancorata sulla blockchain di Bitcoin</b> tramite un impegno crittografico incluso in transazione.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-sm opacity-70 mb-2">3 · Prova &amp; verifica</div>
            <p className="text-sm opacity-90">
              Ricevi una prova con il riferimento on‑chain e le istruzioni per la verifica. In futuro ti basta
              ricalcolare l’impronta del file e controllare che coincida con quella registrata.
            </p>
          </div>
        </div>
      </section>

      {/* PERCHÉ BLOCKCHAIN */}
      <section id="why" className="space-y-5">
        <h2 className="text-3xl font-semibold">Perché blockchain (e perché è solida)</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm opacity-90">
          <li><b>Immutabilità:</b> i blocchi sono protetti da crittografia e consenso distribuito.</li>
          <li><b>Riferimento pubblico:</b> l’ancoraggio fornisce una prova pubblica e verificabile globalmente.</li>
          <li><b>Nessuna fiducia in terzi:</b> la prova è verificabile da chiunque con strumenti pubblici.</li>
          <li><b>Privacy:</b> registriamo <i>solo</i> l’impronta; il file non viene mai condiviso.</li>
          <li><b>Costi e velocità:</b> per la prova di esistenza spesso è più rapido ed economico di pratiche notarili tradizionali.</li>
        </ul>

        <div className="text-xs opacity-70 bg-white/5 border border-white/10 rounded-2xl p-4">
          <b>Nota legale:</b> questa soluzione fornisce una <i>prova tecnica di esistenza e integrità</i>.
          Non sostituisce tutti gli atti o le funzioni del notaio (es. attestazioni d’identità, autentiche, rogiti).
          La rilevanza giuridica può variare per giurisdizione: valuta il contesto d’uso con il tuo consulente legale.
        </div>
      </section>

      {/* PREZZO */}
      <section id="pricing" className="space-y-4">
        <h2 className="text-3xl font-semibold">Prezzo</h2>
        <div className="grid md:grid-cols-1 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-baseline justify-between">
              <div className="text-lg font-medium">Protezione Blockchain</div>
              <div className="text-2xl font-semibold">200 AED (55 USD)</div>
            </div>
            <p className="text-sm opacity-80 mt-2">
              Ancoraggio dell’impronta del tuo file su Bitcoin con guida alla verifica.
            </p>
            <ul className="mt-4 space-y-1 text-sm opacity-90 list-disc pl-5">
              <li>Impronta calcolata in locale (privacy by design)</li>
              <li>Ancoraggio on‑chain con riferimento pubblico</li>
              <li>Documento di prova e istruzioni</li>
              <li>Assistenza base via email</li>
            </ul>
            <a
              href="#"
              className="mt-4 inline-block px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500"
            >
              Acquista protezione
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="space-y-4">
        <h2 className="text-3xl font-semibold">FAQ</h2>

        <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <summary className="cursor-pointer font-medium">Il mio file viene caricato o salvato da qualche parte?</summary>
          <p className="mt-2 text-sm opacity-90">
            No. L’impronta viene calcolata localmente nel tuo browser. Registriamo solo l’impronta (non reversibile).
          </p>
        </details>

        <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <summary className="cursor-pointer font-medium">Cosa dimostra la prova sulla blockchain?</summary>
          <p className="mt-2 text-sm opacity-90">
            Dimostra che un contenuto con <b>quell’impronta specifica</b> era stato registrato su Bitcoin almeno alla data
            del blocco di riferimento. Non rivela il contenuto e non certifica la tua identità: è una prova tecnica
            di esistenza/integrità.
          </p>
        </details>

        <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <summary className="cursor-pointer font-medium">Come verifico in futuro?</summary>
          <p className="mt-2 text-sm opacity-90">
            Ricalcoli l’impronta del file originale e la confronti con quella inclusa nella prova on‑chain.
            Se combaciano, hai integrità e ancoraggio pubblico su Bitcoin.
          </p>
        </details>

        <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <summary className="cursor-pointer font-medium">E se perdo il file?</summary>
          <p className="mt-2 text-sm opacity-90">
            L’impronta non permette di ricostruirlo. Conserva backup sicuri del file originale: la prova serve a
            dimostrarne esistenza e integrità, non a recuperarne il contenuto.
          </p>
        </details>
      </section>
    </div>
  );
}
