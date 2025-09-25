import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services – Blockstamp",
  description: "Additional services by Blockstamp",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Services</h1>

        <div className="max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-1">Ownership Certificate</h2>
          <p className="opacity-80">
            Purchase your Ownership Certificate, which carries legal value in potential
            court proceedings to protect your intellectual property rights.
          </p>

          <div className="mt-6 flex items-center justify-between gap-4">
            <span className="text-lg font-medium">Price 350 AED.</span>
            <button
              type="button"
              className="rounded-2xl px-5 py-3 font-semibold bg-amber-400 hover:bg-amber-300 text-black"
            >
              BUY
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
