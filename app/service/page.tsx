import PortalCheckout from "../components/PortalCheckout";
import CertificateBox from "../components/CertificateBox";
import SeoFaq from "../components/SeoFaq";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protezione diritti intellettuali con blockchain | Blockstamp",
  description: "Marca temporale su Bitcoin per tutelare opere, idee e documenti: prova di paternità, verifica pubblica e certificato scaricabile. Semplice e legale.",
  alternates: { canonical: "https://blockstamp.ae/service" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Protezione diritti intellettuali con blockchain | Blockstamp",
    description: "Tutela proprietà intellettuale con marca temporale su Bitcoin: prova di paternità, verifica pubblica e certificato.",
    url: "https://blockstamp.ae/service",
    type: "website"
  }
};


export default function ServicePageIT() {
  return (
    <main className="beam beam-hero max-w-4xl mx-auto px-4 py-12 space-y-6">
      <CertificateBox locale="it" />
      <div className="mt-6"><PortalCheckout lang="it" label="Paga ora" className="bg-amber-400 hover:bg-amber-300 text-black"/></div>
      <SeoFaq />
</main>
  );
}
