import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-8" dir="rtl" lang="ar">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-semibold">BLOCKSTAMP — إثبات الوجود</h1>
        <LanguageSwitcher />
      </header>

      {/* Hero */}
      <section className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-semibold">احمِ عملك على بلوكتشين بيتكوين</h2>
        <p className="opacity-80">
          طابع زمني عام وغير قابل للتغيير على بيتكوين. الخصوصية أولاً: يتم حساب البصمة (SHA-256) في متصفحك —
          ملفك لا يغادر جهازك إطلاقًا.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="/it#procedura" className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold">الإجراء الكامل (الإيطالية)</a>
          <a href="#pricing" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10">الأسعار</a>
          <a href="#faq" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10">الأسئلة الشائعة</a>
        </div>
      </section>

      {/* Procedure */}
      <section id="procedure" className="space-y-2">
        <h3 className="text-xl font-semibold">كيف يعمل</h3>
        <ol className="list-decimal pr-6 space-y-1 opacity-90">
          <li>حساب بصمة SHA-256 محليًا على جهازك.</li>
          <li>نُسجّل البصمة على بيتكوين عبر OpenTimestamps.</li>
          <li>ستستلم ملف <code>.ots</code> (احتفظ به مع ملفك الأصلي).</li>
          <li>بعد ١–٣ تأكيدات (حوالي ٤٨–٧٢ ساعة) يمكنك التحقق من رقم الكتلة.</li>
        </ol>
        <p className="text-sm opacity-70">
          لواجهة الرفع والإرشاد الكامل، استعمل الصفحة الإيطالية: <a className="underline" href="/it#procedura">/it#procedura</a>.
        </p>
      </section>

      {/* Pricing */}
      <section id="pricing" className="space-y-3">
        <h3 className="text-xl font-semibold">الأسعار</h3>
        <ul className="space-y-1 opacity-90">
          <li>ملف واحد (ZIP مع الملفات الأصلية): <strong>€ 10</strong></li>
          <li>٢–٥ ملفات (ZIP): <strong>€ 20</strong></li>
          <li>٦–١٠ ملفات (ZIP): <strong>€ 30</strong></li>
        </ul>
        <p className="text-sm opacity-70">
          الطابع الزمني عام؛ نحن لا نستلم ملفاتك مطلقًا — فقط البصمة المشفّرة.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="space-y-2">
        <h3 className="text-xl font-semibold">الأسئلة الشائعة</h3>
        <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <summary className="cursor-pointer font-medium">هل تقومون بحفظ ملفّي؟</summary>
          <p className="mt-2 text-sm opacity-90">لا. الحساب يتم محليًا؛ نقوم فقط بتثبيت البصمة على البلوكتشين.</p>
        </details>
        <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <summary className="cursor-pointer font-medium">ماذا لو فقدت الملف؟</summary>
          <p className="mt-2 text-sm opacity-90">
            لا يمكن استعادة المحتوى من البصمة. احتفظ بنسخ احتياطية آمنة: الإثبات يبرهن الوجود والسلامة في وقت معين، وليس استرجاع الملف.
          </p>
        </details>
      </section>

      <div className="beam beam-footer"></div>
    </div>
  );
}
