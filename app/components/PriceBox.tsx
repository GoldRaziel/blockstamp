"use client";

export default function PriceBox() {
  return (
    <div className="bg-sky-950/40 border border-sky-800/40 rounded-xl p-6 text-white space-y-4 shadow-md">
      <div className="text-xs font-semibold uppercase tracking-wide text-sky-200">
        Prezzo
      </div>
      <div className="text-3xl font-bold text-sky-50">
        200 AED <span className="text-lg font-medium">/ file</span>
      </div>

      <div className="text-base font-semibold text-sky-100">
        Protezione Blockchain
      </div>
      <p className="text-sm opacity-90">
        Ancoraggio dell’impronta del tuo file su Bitcoin con guida alla verifica.
      </p>

      <ul className="list-disc pl-5 text-sm space-y-1 opacity-90">
        <li>Impronta calcolata in locale (privacy by design)</li>
        <li>Ancoraggio on-chain con riferimento pubblico</li>
        <li>Documento di prova e istruzioni</li>
        <li>Assistenza base via email</li>
      </ul>

      {/* Bottone lasciato invariato */}
      <button
        onClick={() => window.location.href="/api/pay"}
        className="w-full px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 font-semibold"
      >
        Acquista protezione
      </button>
    </div>
  );
}
