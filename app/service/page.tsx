import PortalCheckout from "../components/PortalCheckout";
import CertificateBox from "../components/CertificateBox";

export default function ServicePageIT() {
  return (
    <main className="beam beam-hero max-w-4xl mx-auto px-4 py-12 space-y-6">
      <CertificateBox locale="it" />
      <div className="mt-6"><PortalCheckout lang="it" label="Paga ora" className="bg-amber-400 hover:bg-amber-300 text-black"/></div>
</main>
  );
}
