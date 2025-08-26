"use client";
import PayNow from "./components/PayNow";
import PayButton from "./components/PayButton";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import VerifyBox from "./components/VerifyBox";
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

async function startPayment() {
  try {
    const res = await fetch(`/api/create-checkout-session?ts=${Date.now()}`, { method: "POST", cache: "no-store" });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    if (!data?.url) throw new Error("URL checkout non ricevuto");
    window.location.href = data.url;
  } catch (e) {
    console.error(e);
    alert("Errore avvio checkout");
  }
}
export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [serverHash, setServerHash] = useState<string>("");
  const [paid, setPaid] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [showPayNotice, setShowPayNotice] = useState(false);

  // verifica stato pagamento
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/session", { cache: "no-store", credentials: "include" });
        const j = await r.json();
        setPaid(!!j.paid);
      } catch {
        /* ignore */
      } finally {
        setSessionReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (paid) setShowPayNotice(false);
  }, [paid]);

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

  async function startPayment() {
    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 500,
          currency: "eur",
          description: "Blockstamp Protection",
        }),
      });
      const json = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error(json.error || "Errore pagamento");
      if (json.url) window.location.href = json.url;
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Errore durante il pagamento.");
    }
  }

  async function submitToServer() {
    if (!hash || !file) return;
    setBusy(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/submit", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "X-Paid": paid ? "1" : "0" },
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
      <div className="beam beam-hero"></div>

      {/* HERO */}
      <section className="hero text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
          <span className="text-white">Protect Your </span>
          <span className="text-sky-400">Idea</span>
          <br />
          <span className="text-white">on the </span>
          <span className="text-sky-400">Blockchain</span>
          <span className="text-sky-400 text-2xl align-middle"> • </span>
          <span className="text-white">Bitcoin</span>
        </h1>
        <p className="text-lg opacity-90 max-w-3xl mx-auto">
          The safest and fastest way to record and protect your intellectual property.
        </p>
      </section>

      {/* UPLOAD (ridotto: solo PriceBox) */}
      


<section id="upload" className="my-10">
  <div className="grid md:grid-cols-2 gap-6 items-start">
    {/* Colonna sinistra: pagamento */}
    <div className="space-y-3">
      <PriceBox />
    </div>

    {/* Colonna destra: Why Blockchain + CTA */}
    
<div className="space-y-6">
  

<h3 className="mt-6 text-xl font-semibold">Why Blockchain</h3>


  <ul className="list-disc pl-6 space-y-2 text-sm opacity-90">
    <li><b>Immutability:</b> once recorded, the proof cannot be altered.</li>
    <li><b>Public proof:</b> a reference verifiable by anyone, anywhere.</li>
    <li><b>Privacy:</b> registriamo solo l’impronta; il file resta tuo.</li>
    <li><b>No intermediaries:</b> independent proof, without blind trust in third parties.</li>
    <li><b>Global validity:</b> a single registration, recognizable anywhere.</li>
  </ul>

  <PayNow />
</div>

  </div>

  {/* Riquadro istruzioni */}
  <div className="mt-10 bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-4">
    <h3 className="text-lg font-semibold flex items-center gap-2">FOLLOW THE INSTRUCTIONS</h3>
    <ol className="list-decimal pl-6 space-y-1 text-sm opacity-90">
      <li>Select the file to protect.</li>
      <li>You will get your unique SHA-256 fingerprint.</li>
      <li><b>Copy</b> the fingerprint and paste it into a <code>.txt</code> text file.</li>
      <li>Compress the original file <i>together</i> with the <code>.txt</code> file into a <code>.zip</code> archive.</li>
      <li>Come back here and click <b>PAY NOW</b>.</li>
      <li>After payment, upload the <code>.zip</code> file on the next page.</li>
    </ol>

    <div className="space-y-3">
      <div>
        <label className="block text-sm opacity-80 mb-1">File</label>
       {/* INPUT FILE nascosto */}
<input
  id="file-upload"
  type="file"
  onChange={(e) => handleFile(e.target.files?.[0] || null)}
  className="hidden"
/>

{/* SOLO IL TASTO è cliccabile per aprire il file */}
<label
  htmlFor="file-upload"
  className="inline-flex items-center justify-center gap-2 px-4 py-2
             bg-neutral-900 hover:bg-neutral-800 text-white
             border border-white/10 rounded-none
             cursor-pointer select-none"
>
  Choose file
</label>

        {file && (
          <div className="text-xs opacity-70 mt-1">{file.name}</div>
        )}
      </div>

      <div>
        <label className="block text-sm opacity-80 mb-1">SHA-256 fingerprint</label>
        <div className="flex gap-2">
          <textarea
            className="flex-1 h-16 rounded-lg bg-black/40 border border-white/10 p-2 text-xs font-mono"
            readOnly
            value={hash}
            placeholder="The fingerprint will appear here…"
          />
          <button
            onClick={copyHash}
            disabled={!hash}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40"
          >
            Copy
          </button>
        </div>
      </div>
    </div>

    <p className="text-xs opacity-70 mt-2">
      Tip: rename the text file to something like <code>hash.txt</code> and keep it inside the <code>.zip</code> next to the original file.
    </p>
  </div>

</section>




      {/* PROCEDURA */}
      <section id="procedure" className="space-y-5">
        <h2 className="text-3xl font-semibold">Procedure</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-sm opacity-70 mb-2">1 · Carica il tuo file</div>
            <p className="text-sm opacity-90">
              Scegli il documento, l’idea o il progetto che vuoi proteggere. Nessun contenuto viene
              reso pubblico: resta solo tuo.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-sm opacity-70 mb-2">2 · Registrazione su Blockchain</div>
            <p className="text-sm opacity-90">
              Creiamo una traccia indelebile che dimostra l’esistenza della tua idea in una data
              certa. Questa prova viene incisa sulla blockchain di Bitcoin, la più sicura al mondo.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-sm opacity-70 mb-2">3 · Prova e Verifica</div>
            <p className="text-sm opacity-90">
              Ricevi una ricevuta digitale che potrai esibire in ogni momento per dimostrare i tuoi
              diritti. In futuro ti basterà confrontarla con il tuo file per provarne l’autenticità.
            </p>
          </div>
        </div>
      </section>

      <VerifyBox />


      {/* GUIDA */}
      <section id="guide" className="space-y-6">
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
              Riceverai un <b>codice .ots</b> a conferma della richiesta: salvalo <b>dentro la stessa
              cartella ZIP</b>.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-2">3 · Registrazione entro 72 ore</h3>
            <p className="text-sm opacity-90">
              Entro <b>72 ore</b> riceverai il codice di registrazione su blockchain Bitcoin che
              certifica l’esistenza del tuo file a livello globale, rendendo la tua idea <b>protetta e
              immodificabile</b>.
            </p>
          </div>
        </div>
        <div className="bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-4">
          <p className="text-sm opacity-90 max-w-3xl mx-auto">
            Risultato: una <b>prova tecnica e legale</b> incisa sulla blockchain di Bitcoin — <b>immodificabile</b> e valida in
            tutto il mondo.
          </p>
        </div>
      </section>

      {/* PERCHÉ BLOCKCHAIN */}
      
      {/* FAQ */}
      <section id="faq" className="space-y-4">
  <h2 className="text-3xl font-semibold">FAQ</h2>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">What is a blockchain?</summary>
    <div className="mt-2 text-sm opacity-90 space-y-2">
      <p>
        A <b>blockchain</b> is a <i>distributed</i>, <i>append-only</i> ledger: a chain of blocks where each block
        contains data (e.g., transactions) and the cryptographic hash of the previous block. This linkage makes the
        whole chain tamper-resistant.
      </p>
      <p className="font-medium">How it works (quickly):</p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Operations are grouped into a new block.</li>
        <li>A unique fingerprint (hash) of the block is computed.</li>
        <li>The block includes the previous block’s hash, forming the chain.</li>
        <li>The network approves the block via <i>consensus</i> (e.g., Proof of Work/Stake).</li>
        <li>Once added, changing it would require rewriting all subsequent blocks.</li>
      </ol>
      <ul className="list-disc pl-5 space-y-1">
        <li><b>Decentralization:</b> no central authority; many nodes share the same ledger.</li>
        <li><b>Transparency:</b> on public chains the history is verifiable by anyone.</li>
        <li><b>Security:</b> cryptography + consensus make forgery extremely hard.</li>
      </ul>
      <p>
        In practice, it’s like a <i>public ledger</i> where every page (block) is linked to the previous one and
        approved by the network — a reliable way to record information without trusting an intermediary.
      </p>
    </div>
  </details>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">Do you upload or store my file?</summary>
    <p className="mt-2 text-sm opacity-90">
      No. The fingerprint is computed locally in your browser. We only record the fingerprint (non-reversible).
    </p>
  </details>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">What does the blockchain proof show?</summary>
    <p className="mt-2 text-sm opacity-90">
      It proves that content with <b>that specific fingerprint</b> was recorded on Bitcoin at least by the reference
      date. It does not reveal the content and does not certify your identity.
    </p>
  </details>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">How do I verify later?</summary>
    <p className="mt-2 text-sm opacity-90">
      Recompute the fingerprint of the original file and compare it to the one included in the proof. If they match,
      you have integrity and a public reference on Bitcoin.
    </p>
  </details>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">What if I lose the file?</summary>
    <p className="mt-2 text-sm opacity-90">
      The fingerprint cannot reconstruct the content. Keep safe backups of the original file: the proof demonstrates
      existence and integrity; it does not recover the content.
    </p>
  </details>
</section>


      <div className="beam beam-footer"></div>
    </div>
  );
}
