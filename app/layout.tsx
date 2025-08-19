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
        <header className="border-b border-white/10">
          <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            {/* Logo (sx) */}
            <div className="flex justify-start">
              <a href="/" className="flex items-center gap-3" aria-label="Vai alla Home">
                <Image
                  src="/logo.png"
                  alt="BLOCKSTAMP logo"
                  width={1000}
                  height={500}
                  priority
                  sizes="(max-width: 768px) 200px, 400px"
                  className="h-auto max-h-14 md:max-h-20 w-auto"
                />
              </a>
            </div>

            {/* Nav: orizzontale anche su mobile, con puntini separatori, no 'Home' */}
            <nav className="text-sm flex items-center flex-wrap gap-x-3 gap-y-1">
              <a className="hover:underline whitespace-nowrap" href="#how-it-works">Procedura</a>
              <span className="opacity-50">•</span>
              <a className="hover:underline whitespace-nowrap" href="#pricing">Prezzo</a>
              <span className="opacity-50">•</span>
              <a className="hover:underline whitespace-nowrap" href="#faq">FAQ</a>
            </nav>
          </div>
        </header>

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
