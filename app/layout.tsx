import NavLinks from "./components/NavLinks";
import LangDropdown from "./components/LangDropdown";
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
<nav className="text-sm flex items-center flex-wrap gap-x-3 gap-y-1">
  <a href="/#procedura" className="hover:underline whitespace-nowrap">PROCEDURA</a>
  <span className="opacity-50">•</span>
  <a href="/#guida" className="hover:underline whitespace-nowrap">GUIDA</a>
  <span className="opacity-50">•</span>
  <a href="/#faq" className="hover:underline whitespace-nowrap">FAQ</a>
  <span className="opacity-50">•</span>
  <a href="/#contatti" className="hover:underline whitespace-nowrap">CONTATTI</a>
  <span className="opacity-50">•</span>
  <LangDropdown />
</nav>
          </div>
</header>

        <main className="container mx-auto px-4 py-10">{children}</main>

        <footer id="contatti" className="border-t border-white/10 mt-16">
          <div className="container mx-auto px-4 py-6 text-sm opacity-80 flex items-center justify-center gap-3 flex-wrap text-center">
            <span>© {year} BLOCKSTAMP — Proof of Existence</span>
            <span className="hidden sm:inline">•</span>
            <a
              href="mailto:blockstamp.protection@gmail.com"
              className="hover:text-sky-400 transition"
            >
              blockstamp.protection@gmail.com
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
