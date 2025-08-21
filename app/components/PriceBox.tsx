'use client';

import { useState } from 'react';

export default function PriceBox() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 500, // esempio: 5.00 EUR in centesimi
          currency: 'eur',
          description: 'Blockstamp Protection',
        }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (res.ok && data?.url) {
        window.location.assign(data.url);
      } else {
        alert(data?.error ?? 'Errore pagamento');
      }
    } catch (e: any) {
      alert(e?.message ?? 'Errore di rete');
    } finally {
      setLoading(false);
    }
  };

  return (
  <button
  onClick={async () => {
    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 500,          // € 5,00 in centesimi (aggiorna se serve)
          currency: 'eur',
          description: 'Blockstamp Protection',
        }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (res.ok && data?.url) {
        window.location.assign(data.url);
      } else {
        alert(data?.error ?? 'Errore pagamento');
      }
    } catch (e: any) {
      alert(e?.message ?? 'Errore di rete');
    }
  }}
  className="w-full px-4 py-2 rounded-lg bg-black text-white font-semibold shadow-md hover:opacity-90 disabled:opacity-50 transition"
  title="Acquista protezione"
>
  ACQUISTA PROTEZIONE
</button>
