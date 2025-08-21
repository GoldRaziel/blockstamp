"use client";

export default function PriceBox() {
  return (
    <div className="bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-sky-100">
        Prezzo
      </div>

      <div className="text-3xl font-bold text-white">
        200 AED <span className="text-lg font-medium">/ file</span>
      </div>

      <div className="text-base font-semibold">Protezione Blockchain</div>
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
