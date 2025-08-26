import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-semibold">BLOCKSTAMP — Proof of Existence</h1>
        <LanguageSwitcher />
      </header>

      {/* Hero */}
      <section className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-semibold">Protect your work on Bitcoin</h2>
        <p className="opacity-80">
          Public, immutable timestamp on Bitcoin. Privacy by design: hashing happens in your browser —
          your file never leaves your device.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="/it#procedura" className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold">Full procedure (IT)</a>
          <a href="#pricing" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10">Price list</a>
          <a href="#faq" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10">FAQ</a>
        </div>
      </section>

      {/* Procedure */}
      <section id="procedure" className="space-y-2">
        <h3 className="text-xl font-semibold">How it works</h3>
        <ol className="list-decimal pl-6 space-y-1 opacity-90">
          <li>Compute the SHA-256 locally (client-side).</li>
          <li>We commit your hash to Bitcoin via OpenTimestamps.</li>
          <li>You receive a <code>.ots</code> receipt (keep it safe with your original file).</li>
          <li>After 1–3 confirmations (48–72h), you can verify the block height.</li>
        </ol>
        <p className="text-sm opacity-70">
          For the full guided flow and upload UI, use the Italian page: <a className="underline" href="/it#procedura">/it#procedura</a>.
        </p>
      </section>

      {/* Pricing (static mirror of IT) */}
      <section id="pricing" className="space-y-3">
        <h3 className="text-xl font-semibold">Price list</h3>
        <ul className="space-y-1 opacity-90">
          <li>1 file (ZIP with originals): <strong>€ 10</strong></li>
          <li>2–5 files (ZIP): <strong>€ 20</strong></li>
          <li>6–10 files (ZIP): <strong>€ 30</strong></li>
        </ul>
        <p className="text-sm opacity-70">
          The timestamp is public; we never receive your file, only its cryptographic hash.
        </p>
      </section>

      {/* FAQ (short) */}
      <section id="faq" className="space-y-2">
        <h3 className="text-xl font-semibold">FAQ</h3>
        <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <summary className="cursor-pointer font-medium">Do you store my file?</summary>
          <p className="mt-2 text-sm opacity-90">No. Hashing is local; we only anchor the hash.</p>
        </details>
        <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <summary className="cursor-pointer font-medium">What if I lose the file?</summary>
          <p className="mt-2 text-sm opacity-90">
            The hash does not reconstruct content. Keep safe backups of your originals: the proof
            shows existence & integrity at a time, not file recovery.
          </p>
        </details>
      </section>

      <div className="beam beam-footer"></div>
    </div>
  );
}
