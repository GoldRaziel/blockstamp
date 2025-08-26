import Hero from "./components/Hero";
import PriceBox from "./components/PriceBox";
import VerifyBox from "./components/VerifyBox";
import PayNow from "./components/PayNow";

export default function Page() {
  return (
    <main className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <Hero />
      <PriceBox />
      <VerifyBox />
      <PayNow />
    </main>
  );
}
