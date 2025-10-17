import GAds from "../components/GAds";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protezione diritti intellettuali con blockchain | Blockstamp",
  description: "Marca temporale su Bitcoin per tutelare opere, idee e documenti: prova di paternità, verifica pubblica e certificato scaricabile. Semplice e affidabile.",
  alternates: { canonical: "https://blockstamp.ae/it" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Protezione diritti intellettuali con blockchain | Blockstamp",
    description: "Marca temporale su Bitcoin per tutelare opere, idee e documenti: prova di paternità, verifica pubblica e certificato scaricabile. Semplice e affidabile.",
    url: "https://blockstamp.ae/it",
    type: "website"
  }
};

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
