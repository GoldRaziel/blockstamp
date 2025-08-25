import Hero from "../components/Hero";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Page() {
  return (
    <>
      <LanguageSwitcher />
      <main className="container mx-auto px-4 py-10 space-y-6">
    <Hero />
        {/* HERO */}
        <section className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold">Protection on Bitcoin</h1>
          <p className="opacity-80">Immutable timestamp of your file.</p>
          <p className="text-sm opacity-70">
            Hashing happens in your browser. Your file never leaves your device.
          </p>
        </section>

        {/* CTA / SHORTCUTS */}
        <section className="flex flex-wrap gap-3">
          <a href="/it#procedura" className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold">
            Go to full procedure (IT)
          </a>
          <a href="#pricing" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10">
            Price list
          </a>
          <a href="#faq" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10">
            FAQ
          </a>
        </section>

        {/* PROCEDURE (summary) */}
        <section id="procedure" className="space-y-2">
          <h2 className="text-2xl font-semibold">How it works</h2>
          <ol className="list-decimal pl-6 space-y-1 opacity-90">
            <li>Compute the SHA‑256 locally (client-side).</li>
            <li>Pay to enable “STAMP”.</li>
            <li>Submit and receive your <code>.ots</code> receipt.</li>
            <li>Later, verify on-chain and retrieve the Bitcoin block height.</li>
          </ol>
        </section>

        {/* PRICING placeholder */}
        <section id="pricing" className="space-y-2">
          <h2 className="text-2xl font-semibold">Price list</h2>
          <p className="opacity-80">Same pricing as the Italian page.</p>
        </section>

        {/* FAQ placeholder */}
        <section id="faq" className="space-y-2">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <p className="opacity-80">For full details, refer to the Italian page.</p>
        </section>

        {/* FOOTER NOTE */}
        <section className="text-sm opacity-70">
          Need help? Write to <a className="underline hover:text-amber-300" href="mailto:blockstamp.protection@gmail.com">blockstamp.protection@gmail.com</a>.
        </section>
      </main>
    </>
  );
}
