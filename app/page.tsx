"use client";

import Image from "next/image";
import { useState } from "react";

export default function Page() {
  const [hash] = useState<string>("");

  return (
    <div className="space-y-10">
      <section className="text-center space-y-6">
        <Image
          src="/logo.png"
          alt="BLOCKSTAMP"
          width={96}
          height={96}
          className="mx-auto mb-2 rounded"
          priority
        />
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
          Proof of Existence
          <br />
          <span className="text-sky-400">Hash locale</span> · Privacy by design
        </h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Genera l&apos;impronta (SHA-256) del tuo file <b>in locale</b>. Nessun upload del contenuto.
        </p>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="space-y-3">
          <label className="block text-sm opacity-80">Seleziona file</label>
          <input
            type="file"
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                       file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
            onChange={() => {}}
          />
          <label className="block text-sm opacity-80 mt-4">SHA-256</label>
          <textarea
            className="w-full h-32 rounded-lg bg-black/40 border border-white/10 p-3 text-sm font-mono"
            readOnly
            value={hash}
            placeholder="L'hash verrà mostrato qui…"
          />
        </div>
      </section>
    </div>
  );
}
