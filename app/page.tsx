"use client";

import { useState } from "react";
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
  const [error, setError] = useState<string>("");
  const [serverHash, setServerHash] = useState<string>("");

  async function handleFile(f?: File | null) {
    if (!f) return;
    setBusy(true);
    setError("");
    setServerHash("");
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

  async function copyHash() {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = hash;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  }

  async function submitToServer() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Errore durante l'invio.");
      setServerHash(json.hash);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Errore durante l'invio al server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-16">
  <div className="glow-band glow-top"></div>
      {/* HERO */}
      <section className="hero text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
          <span className="text-white">Proteggi la Tua </span>
          <span className="text-sky-400">Idea</span>
          <br />
          <span className="text-white">nella </span>
          <span className="text-sky-400">Blockchain</span>
          <span className="text-sky-400 text-2xl align-middle"> • </span>
          <span className="text-white">Bitcoin</span>
        </h1>
        <p className="text-lg opacity-90 max-w-3xl mx-auto">
          Il modo più sicuro e veloce al mondo per registrare e proteggere i tuoi diritti intellettuali.
        </p>
      </section>

      {/* STAMP and VERIFY */}
      <section id="upload" className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold tracking-wide mb-4 text-center">STAMP and VERIFY</h2>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            <label className="block text-sm opacity-80">Seleziona file</label>
            <input
              type="file"
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                         file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              onChange={(e) => handleFile(e.target.files?.[0] || null)}
            />

            {/* PREZZO subito sotto all’upload */}
            <PriceBox />

            {busy && <div className="text-sm opacity-80">Calcolo in corso…</div>}
            {error && <div className="text-sm text-red-400">{error}</div>}
            {file && !busy && (
              <div className="text-sm opacity-80">
                <div>
                  <b>Nome:</b> {file.name}
                </div>
                <div>
                  <b>Dimensione:</b> {file.size.toLocaleString()} byte
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-sm opacity-80">Impronta del file</label>
            <textarea
              className="w-full h-32 rounded-lg bg-black/40 border border-white/10 p-3 text-sm font-mono"
              readOnly
              value={hash}
              placeholder="L'impronta verrà mostrata qui…"
            />
            <div className="flex flex-wrap gap-3">
              <button
                onClick={copyHash}
                disabled={!hash}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40"
              >
                Copia impronta
              </button>
              <button
                onClick={submitToServer}
                disabled={!hash || !file}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40"
              >
                ✅ Timbra ora
              </button>
            </div>
            {serverHash && (
              <p className="text-xs mt-3 text-green-400">
                ✅ Hash ricevuto dal server: <code className="break-all">{serverHash}</code>
              </p>
            )}
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
            <div className="text-sm opacity-70 mb-2">1 · Carica il tuo file</div>
            <p className="text-sm opacity-90">
              Scegli il documento, l’idea o il progetto che vuoi proteggere.
              Nessun contenuto viene reso pubblico: resta solo tuo.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-sm opacity-70 mb-2">2 · Registrazione su Blockchain</div>
            <p className="text-sm opacity-90">
              Creiamo una traccia indelebile che dimostra l’esistenza della tua idea in una data certa.
              Questa prova viene incisa sulla blockchain di Bitcoin, la più sicura al mondo.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-sm opacity-70 mb-2">3 · Prova e Verifica</div>
            <p className="text-sm opacity-90">
              Ricevi una ricevuta digitale che potrai esibire in ogni momento per dimostrare i tuoi diritti.
              In futuro ti basterà confrontarla con il tuo file per provarne l’autenticità.
            </p>
          </div>
        </div>
      </section>

      {/* GUIDA */}
      <section id="guida" className="space-y-6">
        <h2 className="text-3xl font-semibold">Guida: proteggi al meglio la tua idea</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">1 · Crea un file ZIP</h3>
            <p className="text-sm opacity-90">
              Inserisci <b>più materiale possibile</b>: documenti, testi, immagini, bozze, progetti,
              struttura del sito, contratti — tutto ciò che dimostra la paternità dell’idea.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">2 · Carica in HOME</h3>
            <p className="text-sm opacity-90">
              Vai alla sezione <a href="#upload" className="underline">Upload</a> e carica il tuo ZIP.
              Riceverai un <b>codice .ots</b> a conferma della richiesta: salvalo <b>dentro la stessa cartella ZIP</b>.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">3 · Registrazione entro 72 ore</h3>
            <p className="text-sm opacity-90">
              Entro <b>72 ore</b> riceverai il codice di registrazione su blockchain Bitcoin che certifica
              l’esistenza del tuo file a livello globale, rendendo la tua idea <b>protetta e immodificabile</b>.
            </p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-sm opacity-90 max-w-3xl mx-auto">
            Risultato: una <b>prova tecnica e legale</b> incisa sulla blockchain di Bitcoin —
            valida in tutto il mondo e non manipolabile da nessuno.
          </p>
        </div>
      </section>

      {/* PERCHÉ BLOCKCHAIN */}
      <section id="why" className="space-y-5">
        <h2 className="text-3xl font-semibold">Perché Blockchain</h2>
        <ul className="list-disc pl-6 space-y-2 text-sm opacity-90">
          <li><b>Immutabilità:</b> una volta registrata, la prova non può essere alterata.</li>
          <li><b>Prova pubblica:</b> riferimento verificabile da chiunque, ovunque.</li>
          <li><b>Privacy:</b> registriamo solo l’impronta; il file resta tuo.</li>
          <li><b>Nessuna intermediazione:</b> prova indipendente, senza fiducia cieca in terzi.</li>
          <li><b>Validità globale:</b> una registrazione unica, riconoscibile ovunque.</li>
        </ul>
        <div className="text-xs opacity-70 bg-white/5 border border-white/10 rounded-2xl p-4">
          <b>Nota legale:</b> questa soluzione fornisce una <i>prova tecnica di esistenza e integrità</i>.
          Non sostituisce tutti gli atti o le funzioni del notaio. Valuta il contesto d’uso con il tuo consulente.
        </div>
      </section>

      {/* PREZZO */}

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
            Dimostra che un contenuto con <b>quell’impronta specifica</b> era stato registrato su Bitcoin almeno alla
            data di riferimento. Non rivela il contenuto e non certifica la tua identità.
          </p>
        </details>

        <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <summary className="cursor-pointer font-medium">Come verifico in futuro?</summary>
          <p className="mt-2 text-sm opacity-90">
            Ricalcoli l’impronta del file originale e la confronti con quella inclusa nella prova. Se combaciano,
            hai integrità e riferimento pubblico su Bitcoin.
          </p>
        </details>

        <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <summary className="cursor-pointer font-medium">E se perdo il file?</summary>
          <p className="mt-2 text-sm opacity-90">
            L’impronta non permette di ricostruirlo. Conserva backup sicuri del file originale: la prova dimostra
            esistenza e integrità, non recupera il contenuto.
          </p>
        </details>
      </section>
      <div className="glow-band glow-bottom"></div>
</div>
  );
}
