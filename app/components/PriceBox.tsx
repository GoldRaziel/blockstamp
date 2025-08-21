'use client';

import { useState } from 'react';

type PriceBoxProps = {
  amount?: number;              // in centesimi (es. 500 = € 5,00)
  currency?: string;            // 'eur' | 'usd' ...
  description?: string;         // descrizione mostrata a Stripe
  plan?: string;                // metadato opzionale
  label?: string;               // testo del bottone
};

export default function PriceBox({
  amount = 500,
  currency = 'eur',
  description = 'Blockstamp Protection',
  plan = 'basic',
  label = 'ACQUISTA PROTEZIONE',
}: PriceBoxProps) {
  const [loading, setLoading] = useState(false);
  const pretty = (amount / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          description,
          metadata: { plan },
        }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        alert(data?.error ?? 'Payment init failed');
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold">Protezione</h3>
        <div className="text-3xl font-bold">
          {pretty} {currency.toUpperCase()}
        </div>
        <p className="text-xs opacity-70">Registrazione su blockchain Bitcoin</p>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full px-4 py-2 rounded-lg bg-black text-white font-semibold shadow-md hover:opacity-90 disabled:opacity-50 transition"
        title="Acquista protezione"
      >
        {loading ? 'Reindirizzamento…' : label}
      </button>

      <ul className="text-sm opacity-90 list-disc pl-5 space-y-1">
        <li>Prova tecnica d’esistenza (hash) su Bitcoin</li>
        <li>File non caricato: resta sul tuo dispositivo</li>
        <li>Ricevuta digitale verificabile</li>
      </ul>
    </div>
  );
}
