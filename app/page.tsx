"use client";

import React, { useEffect, useState } from "react";

function toHex(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, "0");
  return out;
}

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [paid, setPaid] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);          // mostra banner solo dopo check
  const [showPayNotice, setShowPayNotice] = useState<boolean>(false); // avviso al click se non pagato

  // Calcolo hash locale (privacy-by-design)
  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setError("");
        if (!file) {
          setHash("");
          return;
        }
        const buf = await file.arrayBuffer();
        const digest = await crypto.subtle.digest("SHA-256", buf);
        if (!cancelled) setHash(toHex(digest));
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Errore nel calcolo hash");
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [file]);

  // Verifica stato pagamento (no cache, node runtime sulla route /api/session)
  useEffect(() => {
    let alive = true;
    fetch("/api/session", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { paid: false }))
      .then((d) => {
        if (alive) setPaid(!!d.paid);
      })
      .catch(() => {
        if (alive) setPaid(false);
      })
      .finally(() => {
        if (alive) setChecked(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setShowPayNotice(false);
  }

  async function submitToServer() {
    if (!paid) {
      setShowPayNotice(true);
      return;
    }
    if (!file) {
      setError("Seleziona un file prima di timbrare.");
      return;
    }
    try {
      setBusy(true);
      setError("");
      // TIMBRA → /api/stamp (ritorna .ots)
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/stamp", { method: "POST", body: fd });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Errore TIMBRA: ${res.status} ${txt}`);
      }
      // salva la ricevuta .ots
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (file.name || "file") + ".ots";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e?.message || "Errore durante la timbratura.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Banner verde: SOLO dopo il check e se pagato */}
      {checked && paid && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm">
          ✅ Pagamento effettuato, TIMBRA attivo
        </div>
      )}

      {/* Selettore file + info hash */}
      <section className="space-y-3">
        <label className="block text-sm opacity-80">Seleziona un file da timbrare</label>
        <input type="file" onChange={onSelectFile} />

        <p className="text-sm opacity-80">
          Il calcolo avviene nel tuo browser. Il file non lascia mai il tuo dispositivo.
        </p>

        {/* Avviso giallo solo dopo click TIMBRA senza pagamento */}
        {!paid && showPayNotice && (
          <p className="mt-1 text-sm text-yellow-500">Effettua il pagamento per attivare TIMBRA.</p>
        )}

        {hash && (
          <div className="text-xs break-all opacity-80">
            <span className="opacity-70">SHA-256:</span> {hash}
          </div>
        )}
      </section>

      {/* Azioni */}
      <section className="flex items-center gap-3">
        <button
          disabled={busy}
          onClick={(e) => {
            e.preventDefault();
            submitToServer();
          }}
          className="px-4 py-2 rounded-md border border-white/20 hover:border-white/40 disabled:opacity-50"
        >
          {busy ? "TIMBRO..." : "TIMBRA"}
        </button>
      </section>

      {/* Errori */}
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
