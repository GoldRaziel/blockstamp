import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servizi – Blockstamp",
  description: "Servizi aggiuntivi Blockstamp",
};

export default function ServiziPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Servizi</h1>

        <div className="max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-1">CERTIFICA DI PROPRIETA'</h2>
          <p className="opacity-80">
            Acquista il tuo Certificato di Proprietà quale valore legale in fase di eventuale
            giudizio per la protezione dei tuoi diritti intelettuali.
          </p>

          <div className="mt-6 flex items-center justify-between gap-4">
            <span className="text-lg font-medium">Prezzo 350 AED.</span>
            <button
              type="button"
              className="rounded-2xl px-5 py-3 font-semibold bg-amber-400 hover:bg-amber-300 text-black"
            >
              ACQUISTA
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
