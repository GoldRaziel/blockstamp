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
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            {/* LOGO ridotto a 1/3 e cliccabile verso Home */}
           <a href="/" className="flex items-center gap-3" aria-label="Vai alla Home">
  <Image
    src="/logo.png"
    alt="BLOCKSTAMP logo"
    width={160}
    height={160}
    priority
    className="h-8 w-auto rounded"
  />
</a>

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

