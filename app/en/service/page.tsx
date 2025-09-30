import PortalCheckout from "../../components/PortalCheckout";
import CertificateBox from "../../components/CertificateBox";

export default function ServicePageEN() {
  return (
    <main className="beam beam-hero max-w-4xl mx-auto px-4 py-12 space-y-6">
      <CertificateBox locale="en" />
      <div className="mt-6"><PortalCheckout lang="en" label="Pay now" className="bg-amber-400 hover:bg-amber-300 text-black"/></div>
</main>
  );
}
