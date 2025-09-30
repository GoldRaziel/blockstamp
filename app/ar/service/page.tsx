import PortalCheckout from "../../components/PortalCheckout";
import CertificateBox from "../../components/CertificateBox";

export default function ServicePageAR() {
  return (
    <main className="beam beam-hero max-w-4xl mx-auto px-4 py-12 space-y-6">
      <CertificateBox locale="ar" />
      <div className="mt-6"><PortalCheckout lang="ar" label="ادفع الآن" className="bg-amber-400 hover:bg-amber-300 text-black"/></div>
</main>
  );
}
