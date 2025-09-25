import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الخدمات – Blockstamp",
  description: "خدمات إضافية من Blockstamp",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">الخدمات</h1>

        <div className="max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-1">شهادة الملكية</h2>
          <p className="opacity-80">
            اشترِ شهادة الملكية التي تحمل قيمة قانونية في حال الإجراءات القضائية المحتملة،
            وتَحمي حقوق الملكية الفكرية الخاصة بك.
          </p>

        <div className="mt-6 flex items-center justify-between gap-4">
            <span className="text-lg font-medium">السعر 350 درهم.</span>
            <button
              type="button"
              className="rounded-2xl px-5 py-3 font-semibold bg-amber-400 hover:bg-amber-300 text-black"
            >
              اشترِ الآن
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
