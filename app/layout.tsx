import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BLOCKSTAMP — Proof of Existence",
  description: "Timestamp & verify on Bitcoin (OpenTimestamps).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();
  return (
    <html lang="it">
      <body className="min-h-screen bg-black text-white flex flex-col">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-white/10 py-6 text-center">
          <p className="text-sm opacity-80">
            © {year} BLOCKSTAMP — Proof of Existence •{" "}
            <a className="underline hover:opacity-80" href="mailto:blockstamp.protection@gmail.com">
              blockstamp.protection@gmail.com
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
