import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "BLOCKSTAMP — Proof of Existence",
  description: "Hash locale, prova di esistenza su blockchain. Privacy by design.",
  openGraph: {
    title: "BLOCKSTAMP — Proof of Existence",
    description: "Hash locale e timestamp pubblico su blockchain.",
    type: "website"
  },
  icons: { icon: "/logo.png", shortcut: "/logo.png", apple: "/logo.png" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        {/* HEADER sticky/fisso */}
        <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#0b0f14]/70 backdrop-blur supports-[backdrop-filter]:bg-[#0b0f14]/60">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo in navbar (consigliato tenere SOLO qui, togli dall'hero) */}
              <Image
                src="/logo.png"
                alt="BLOCKSTAMP logo"
                width={160}
                height={160}
                priority
                className="h-9 w-auto rounded"
                sizes="(max-width: 768px) 120px, 160px"
              />
            </div>
            <nav className="text-sm">
              <a className="hover:underline" href="/">Home</a>
              <span className="mx-3 opacity-50">•</span>
              <a className="hover:underline" href="#how-it-works">Come funziona</a>
              <span className="mx-3 opacity-50">•</span>
              <a className="hover:underline" href="#pricing">Prezzo</a>
              <span className="mx-3 opacity-50">•</span>
              <a className="hover:underline" href="#faq">FAQ</a>
            </nav>
          </div>
        </header>

        {/* SPACER: evita che il contenuto finisca sotto l'header fisso */}
        <div className="h-16 md:h-[72px]" />

        {/* MAIN */}
        <main className="container mx-auto px-4 py-10">{children}</main>

        <footer className="border-t border-white/10 mt-16">
          <div className="container mx-auto px-4 py-6 text-sm opacity-80">
            © {new Date().getFullYear()} BLOCKSTAMP — Proof of Existence
          </div>
        </footer>
      </body>
    </html>
  );
}
