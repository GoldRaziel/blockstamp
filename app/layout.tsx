import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BLOCKSTAMP — Proof of Existence",
  description: "Hash locale, richiesta di marcatura su Bitcoin/OpenTimestamps. Privacy by design.",
  openGraph: {
    title: "BLOCKSTAMP — Proof of Existence",
    description: "Hash locale, richiesta di marcatura su Bitcoin/OpenTimestamps.",
    type: "website"
  },
  icons: { icon: "/logo.svg" } // usiamo SVG così non serve un .ico binario
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <header className="border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-sky-400">
                <path d="M12 2L3 6v6c0 5 4 9 9 10 5-1 9-5 9-10V6l-9-4Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-semibold tracking-wide">BLOCKSTAMP</span>
            </div>
            <nav className="text-sm">
              <a className="hover:underline" href="/">Home</a>
              <span className="mx-3 opacity-50">•</span>
              <a className="hover:underline" href="#pricing">Prezzi</a>
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
