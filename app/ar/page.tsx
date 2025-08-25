import Hero from "./components/Hero";
import PriceBox from "./components/PriceBox";
import VerifyBox from "./components/VerifyBox";
import PayNow from "./components/PayNow";
import NavLinks from "./components/NavLinks";
import LanguageSwitcher from "./components/LanguageSwitcher";

export default function Page() {
  return (
    <main className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <NavLinks />
        <LanguageSwitcher />
      </div>

      <Hero />
      <PriceBox />
      <VerifyBox />
      <PayNow />
    </main>
  );
}
