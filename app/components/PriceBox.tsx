"use client";
import React from "react";

export default function PriceBox() {
  return (
    <div className="mt-3 rounded-lg border border-sky-300/50 bg-sky-900/20 p-4 text-sky-100">
      <div className="text-xs uppercase tracking-widest text-sky-300">Prezzo</div>
      <div className="mt-1 text-2xl font-semibold">200 AED / file</div>

      <div className="mt-3 text-base font-semibold text-white">Protezione Blockchain</div>
      <p className="mt-1 text-sm opacity-90">
        Ancoraggio dell’impronta del tuo file su Bitcoin con guida alla verifica.
      </p>

      <ul className="mt-3 list-disc pl-5 space-y-1 text-sm opacity-90">
        <li>Impronta calcolata in locale (privacy by design)</li>
        <li>Ancoraggio on-chain con riferimento pubblico</li>
        <li>Documento di prova e istruzioni</li>
        <li>Assistenza base via email</li>
      </ul>

      <a
        href="#upload"
        className="mt-4 inline-block px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500"
      >
        Acquista protezione
      </a>
    </div>
  );
}
