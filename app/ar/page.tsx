import Hero from "../components/Hero";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function Page() {
  return (
    <>
      <LanguageSwitcher />
      <main className="container mx-auto px-4 py-10 space-y-6" dir="rtl">
    <Hero />
        {/* HERO */}
        <section className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold">حماية على شبكة بيتكوين</h1>
          <p className="opacity-80">ختم زمني غير قابل للتغيير لملفك.</p>
          <p className="text-sm opacity-70">
            تتم عملية التجزئة داخل متصفحك. لن يغادر ملفك جهازك أبدًا.
          </p>
        </section>

        {/* CTA / SHORTCUTS */}
        <section className="flex flex-wrap gap-3">
          <a href="/it#procedura" className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold">
            اذهب للإصدار الكامل (الإيطالية)
          </a>
          <a href="#pricing" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10">
            قائمة الأسعار
          </a>
          <a href="#faq" className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10">
            الأسئلة الشائعة
          </a>
        </section>

        {/* PROCEDURE (summary) */}
        <section id="procedure" className="space-y-2">
          <h2 className="text-2xl font-semibold">كيف تعمل الخدمة</h2>
          <ol className="list-decimal pl-6 space-y-1 opacity-90" style={{direction:'ltr', textAlign:'right'}}>
            <li>حساب SHA‑256 محليًا (على المتصفح).</li>
            <li>الدفع لتفعيل زر «خَتْم».</li>
            <li>الإرسال والحصول على إيصال <code>.ots</code>.</li>
            <li>لاحقًا: التحقق على السلسلة والحصول على رقم كتلة البيتكوين.</li>
          </ol>
        </section>

        {/* PRICING placeholder */}
        <section id="pricing" className="space-y-2">
          <h2 className="text-2xl font-semibold">قائمة الأسعار</h2>
          <p className="opacity-80">نفس التسعير في الصفحة الإيطالية.</p>
        </section>

        {/* FAQ placeholder */}
        <section id="faq" className="space-y-2">
          <h2 className="text-2xl font-semibold">الأسئلة الشائعة</h2>
          <p className="opacity-80">لجميع التفاصيل، راجع الصفحة الإيطالية.</p>
        </section>

        {/* FOOTER NOTE */}
        <section className="text-sm opacity-70">
          للمساعدة: <a className="underline hover:text-amber-300" href="mailto:blockstamp.protection@gmail.com">blockstamp.protection@gmail.com</a>
        </section>
      </main>
    </>
  );
}
