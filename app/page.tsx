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
  const [error, setError] = useState<string>("");
  const [serverHash, setServerHash] = useState<string>("");
  const [paid, setPaid] = useState(false);
  const [sessionReady, setSessionReady] = useState(false); // ⬅️ sblocco TIMBRA dopo pagamento
  const [showPayNotice, setShowPayNotice] = useState(false); // ⬅️ avviso SOLO su click TIMBRA senza pagamento

  // 👉 verifica stato pagamento (cookie httpOnly lato server)
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/session", { cache: "no-store", credentials: "include" });
        const j = await r.json();
        setPaid(!!j.paid);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  // Se risulta pagato, nascondi l’avviso
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

  // 👉 crea sessione Stripe Checkout e reindirizza (se vuoi usarlo altrove)
  async function startPayment() {
    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 500, // es. 5.00 (minor units)
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
    // Blocco: serve hash e file
    if (!hash || !file) return;

    // Se non hai pagato, mostra SOLO ora l’avviso e non inviare
    setBusy(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/submit",{ method:"POST", credentials:"include", cache:"no-store", headers:{ "X-Paid": paid ? "1" : "0" }, body: formData });
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
    }
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

            <div className="space-y-2">
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
                  disabled={!sessionReady || !paid || !hash || !file}
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40"
                >
                  Copia impronta
                </button>
                <a href="/pay" className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400">💳 Attiva TIMBRA</a>

              </div>
              {serverHash && (
                <p className="text-xs mt-1 text-green-400">
                  ✅ Hash ricevuto dal server: <code className="break-all">{serverHash}</code>
                </p>
              )}
              <p className="text-xs opacity-70">
                Il calcolo avviene nel tuo browser. Il file non lascia mai il tuo dispositivo.
              </p>
              {/* ⬇️ Avviso mostrato SOLO dopo click TIMBRA senza pagamento */}</div>
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
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-sm opacity-90 max-w-3xl mx-auto">
            Risultato: una <b>prova tecnica e legale</b> incisa sulla blockchain di Bitcoin — valida in
            tutto il mondo e non manipolabile da nessuno.
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
          Non sostituisce tutti gli atti o le funzioni del notaio. Valuta il contesto d’uso con il tuo
          consulente.
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="space-y-4">
        <h2 className="text-3xl font-semibold">FAQ</h2>

        <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <summary className="cursor-pointer font-medium">Cosa è una blockchain?</summary>
          <div className="mt-2 text-sm opacity-90 space-y-2">
            <p>
              La <b>blockchain</b> è un <i>registro digitale distribuito</i> e <i>immutabile</i>:
              una catena di blocchi, dove ogni blocco contiene dati (es. transazioni) e l’hash
              crittografico del blocco precedente. Questo collegamento rende l’intera catena
              resistente alle manomissioni.
            </p>
            <p className="font-medium">Come funziona in breve:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Le operazioni vengono raccolte in un nuovo blocco.</li>
              <li>Si calcola un’impronta univoca (hash) del blocco.</li>
              <li>Il blocco include l’hash del precedente, formando la catena.</li>
              <li>La rete approva il blocco tramite meccanismi di <i>consenso</i> (es. Proof of Work/Stake).</li>
              <li>Una volta aggiunto, modificarlo richiederebbe riscrivere tutti i blocchi successivi.</li>
            </ol>
            <ul className="list-disc pl-5 space-y-1">
              <li><b>Decentralizzazione:</b> nessuna autorità centrale; più nodi condividono lo stesso registro.</li>
              <li><b>Trasparenza:</b> nelle blockchain pubbliche lo storico è verificabile da chiunque.</li>
              <li><b>Sicurezza:</b> crittografia + consenso rendono difficile la falsificazione.</li>
            </ul>
            <p>
              In pratica, è come un <i>libro mastro pubblico</i> dove ogni pagina (blocco)
              è collegata alla precedente e approvata dalla comunità: un modo affidabile
              di registrare informazioni senza dover credere a un intermediario.
            </p>
          </div>
        </details>

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

      <div className="beam beam-footer"></div>
    </div>
  );
}
