'use client';

import { useState } from 'react';

export default function PriceBox() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 20000,                 // 200 AED in minor units
          currency: 'aed',
          description: 'Protezione Blockchain',
        }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        alert(data?.error ?? 'Errore pagamento');
        return;
      }
      if (data?.url) {
        window.location.assign(data.url);
      } else {
        alert('Checkout URL non ricevuta');
      }
    } catch (e: any) {
      alert(e?.message ?? 'Errore di rete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b2b3a] p-6 space-y-4 text-sky-50">
      <div className="text-xs tracking-widest opacity-70">PREZZO</div>

      <div className="text-4xl font-bold leading-tight">
        <span>200 AED</span> <span className="text-2xl font-semibold opacity-90">/ file</span>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Protezione Blockchain</h3>
        <p className="text-sm opacity-90">
          Ancoraggio dell’impronta del tuo file su Bitcoin con guida alla verifica.
        </p>
      </div>

      <ul className="list-disc pl-5 space-y-1 text-sm opacity-95">
        <li>Impronta calcolata in locale (privacy by design)</li>
        <li>Ancoraggio on-chain con riferimento pubblico</li>
        <li>Documento di prova e istruzioni</li>
        <li>Assistenza base via email</li>
      </ul>

      <div>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold shadow-md hover:bg-sky-500 disabled:opacity-50 transition"
          title="Acquista protezione"
        >
          {loading ? 'Reindirizzamento…' : 'Acquista protezione'}
        </button>
      </div>
    </div>
  );
}
