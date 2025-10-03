import VerifyBox from "../components/VerifyBox";

export const dynamic = "force-dynamic";

export default function VerifyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">VERIFY</h1>
      <VerifyBox />
    </main>
  );
}
