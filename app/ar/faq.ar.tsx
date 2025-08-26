<section id="faq" className="space-y-4" dir="rtl" lang="ar">
  <h2 className="text-3xl font-semibold">الأسئلة الشائعة</h2>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">ما هي البلوكتشين؟</summary>
    <div className="mt-2 text-sm opacity-90 space-y-2">
      <p>
        <b>البلوكتشين</b> سجل موزّع وغير قابل للتلاعب: سلسلة من الكُتل، كل كتلة تحتوي بيانات
        (مثل المعاملات) وهاش الكتلة السابقة. هذا الربط يجعل السلسلة مقاومة للتزوير.
      </p>
      <p className="font-medium">كيف تعمل باختصار:</p>
      <ol className="list-decimal pr-5 space-y-1">
        <li>تُجمّع العمليات في كتلة جديدة.</li>
        <li>يُحسب بصمة (هاش) فريدة للكتلة.</li>
        <li>تتضمن الكتلة هاش الكتلة السابقة، فتتشكل السلسلة.</li>
        <li>توافق الشبكة على الكتلة عبر <i>آليات إجماع</i> (مثل إثبات العمل/إثبات الحصّة).</li>
        <li>بعد الإضافة، تغييرها يتطلب إعادة كتابة كل الكُتل اللاحقة.</li>
      </ol>
      <ul className="list-disc pr-5 space-y-1">
        <li><b>اللامركزية:</b> لا سلطة مركزية؛ عقد عديدة تتشارك السجل نفسه.</li>
        <li><b>الشفافية:</b> في الشبكات العامة، السجل متاح للتحقق من الجميع.</li>
        <li><b>الأمان:</b> التشفير + الإجماع يصعّبان التزوير للغاية.</li>
      </ul>
      <p>
        عمليًا هو كـ<i>دفتر أستاذ عام</i> ترتبط فيه كل صفحة (كتلة) بالسابقة وتُوافق عليها الشبكة —
        طريقة موثوقة لتسجيل المعلومات دون وسيط.
      </p>
    </div>
  </details>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">هل يتم رفع ملفي أو تخزينه؟</summary>
    <p className="mt-2 text-sm opacity-90">
      لا. تُحسب البصمة محليًا داخل المتصفح. نقوم فقط بتثبيت البصمة (غير قابلة للعكس).
    </p>
  </details>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">ماذا تُثبت الحُجّة على البلوكتشين؟</summary>
    <p className="mt-2 text-sm opacity-90">
      تُثبت أن محتوىً ذو <b>تلك البصمة المحدّدة</b> قد تم تسجيله على بيتكوين على الأقل بتاريخ الإشارة. لا تكشف المحتوى ولا تثبت هويتك.
    </p>
  </details>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">كيف أتحقق لاحقًا؟</summary>
    <p className="mt-2 text-sm opacity-90">
      أعد حساب بصمة الملف الأصلي وقارنها مع البصمة الموجودة في الإثبات. إذا تطابقت، فلدَيك سلامة ومرجع عام على بيتكوين.
    </p>
  </details>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">ماذا لو فقدت الملف؟</summary>
    <p className="mt-2 text-sm opacity-90">
      لا يمكن للبصمة استعادة المحتوى. احتفظ بنُسخ احتياطية آمنة للملف الأصلي؛ الإثبات يبرهن الوجود والسلامة في وقت محدد ولا يسترجع المحتوى.
    </p>
  </details>
</section>
