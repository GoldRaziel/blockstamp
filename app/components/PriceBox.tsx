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
          amount: 500,               // esempio: 5.00 €
          currency: 'eur',
          description: 'Blockstamp Protection',
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
      <h3 className="text-lg font-semibold text-center">Protezione</h3>
      <p className="text-sm opacity-80 text-center">
        Registrazione su blockchain Bitcoin con ricevuta digitale verificabile.
      </p>

      <div className="text-center">
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
