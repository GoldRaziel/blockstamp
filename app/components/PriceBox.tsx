"use client";

type Props = {
  onPay?: () => void;
};

export default function PriceBox({ onPay }: Props) {
  async function defaultStartPayment() {
    try {
    const seg0 = (typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "it");
     const locale = (seg0 === "en" || seg0 === "ar" || seg0 === "it") ? seg0 : "it";
      const res = await fetch(`/api/pay?locale=${locale}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, 
          amount: 500,           // minor units (es. 5.00 EUR)
          currency: "eur",
          description: "Blockstamp Protection",
        }),
      });
      const json = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error(json.error || "Errore pagamento");
      if (json.url) window.location.href = json.url;
    } catch (e) {
      console.error(e);
      // opzionale: potresti mostrare un toast qui
    }
  }

  return (
    <div className="bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-sky-300">
        PREZZO
      </div>

      <div className="text-3xl font-bold text-yellow-500">
  1200 AED <span className="text-lg text-sky-100 font-medium">/ file</span>
</div>


      <div className="text-base font-semibold">Protezione Blockchain</div>

      <ul className="list-disc pl-5 text-sm space-y-1 opacity-90">
  <li>Ancoraggio crittografico dell’impronta del file su blockchain Bitcoin</li>
  <li>Impronta calcolata in locale (privacy by design)</li>
  <li>Certificato PDF di prova ufficiale legale</li>
  <li>Il tuo blocco nella blockchain Bitcoin come garanzia universale e permanente</li>
</ul>

      {/* Bottone invariato per stile; onClick torna a fare la POST corretta */}
      
    </div>
  );
}
