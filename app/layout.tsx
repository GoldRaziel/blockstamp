// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "BLOCKSTAMP — Proof of Existence",
  description: "Hash locale, prova di esistenza su blockchain. Privacy by design.",
  openGraph: {
    title: "BLOCKSTAMP — Proof of Existence",
    description: "Hash locale e timestamp pubblico su blockchain.",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/favicon-180x180.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();

  // Modifica qui l’elenco delle voci; puoi commentare/rimuovere PREZZO senza creare doppi separatori
  const navLinks: Array<{ href: string; label: string }> = [
    { href: "/#procedura", label: "PROCEDURA" },
    { href: "/#guida", label: "GUIDA" },
    // { href: "/#pricing", label: "PREZZO" }, // <- se la pagina/ancora non esiste più, lasciala commentata
    { href: "/#faq", label: "FAQ" },
    { href: "/contatti", label: "CONTATTI" },
  ];

  return (
    <html lang="it">
      <body>
        <header className="border-b border-white/10">
          <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex justify-start">
              <a href="/" className="flex items-center gap-3" aria-label="Vai alla Home">
                <Image
                  src="/logo.png"
                  alt="BLOCKSTAMP logo"
                  width={1000}
                  height={500}
                  priority
                  sizes="(max-width: 768px) 200px, 400px"
                  className="h-auto max-h-14 md:max-h-20 w-auto origin-left md:scale-100 scale-[1.15]"
                />
              </a>
            </div>

            <nav className="text-sm flex items-center flex-wrap gap-y-1">
              <ul className="flex items-center flex-wrap">
                {navLinks.map((link, i) => (
                  <li key={link.href} className="flex items-center">
                    {i > 0 && <span className="opacity-50 mx-3">•</span>}
                    <a className="hover:underline whitespace-nowrap" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-10">{children}</main>

        <footer className="border-t border-white/10 mt-16">
          <div className="container mx-auto px-4 py-6 text-sm opacity-80">
            © {year} BLOCKSTAMP — Proof of Existence
          </div>
        </footer>
      </body>
    </html>
  );
}
