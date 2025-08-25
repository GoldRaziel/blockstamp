export const CONTENT_HERO: any = {
  title: "اختبار — توثيق بيتكوين",
  subtitle:
    "ارفع ملفك، ادفع بأمان، واحصل على إثبات يمكن التحقق منه (.ots). خصوصية وسرعة وموثوقية.",
  ctaPrimary: "ابدأ التوثيق",
  ctaSecondary: "كيف تعمل الخدمة",
};

export const NAV_LINKS: any[] = [
  { href: "/ar#how", label: "الإجراءات" },
  { href: "/ar#price", label: "السعر" },
  { href: "/ar#verify", label: "التحقق" },
  { href: "/ar#faq", label: "الأسئلة الشائعة" },
  { href: "/ar#contact", label: "تواصل" },
];

export const PRICE_BOX: any = {
  title: "السعر",
  points: [
    "دفعة واحدة شاملة الضرائب.",
    "نزّل ملف .ots واحتفظ به مع ملف .zip الأصلي.",
    "تأكيد على السلسلة خلال 48–72 ساعة (عادةً).",
    "يمكنك معرفة Block Height في قسم التحقق في أي وقت.",
  ],
  button: "ادفع الآن",
};

export const VERIFY_BOX: any = {
  title: "التحقق",
  intro:
    "ارفع ملف .ots بالأسفل واضغط تحقّق. ستحصل على رقم الحظر (Block Height) المسجّل على بيتكوين.",
  helper:
    "يتم حساب الهاش داخل متصفحك. لا يغادر ملفك جهازك مطلقًا.",
  action: "تحقّق",
  resultLabel: "Block Height",
};

export const PAY_TEXTS: any = {
  payNow: "ادفع الآن",
  payToUnlock: "أكمل الدفع لفتح زر التوثيق",
  paidSuccess: "تم استلام الدفع. يمكنك الآن التوثيق.",
};

export const LANG_DROPDOWN: any = {
  label: "اللغة",
  it: "الإيطالية",
  en: "الإنجليزية",
  ar: "العربية",
};

export const MISC: any = {
  chooseFile: "اختر ملفًا",
  stamp: "وثّق",
  or: "أو",
};

export const STRINGS: any = {};
/* ---- compatibility exports for NavLinks.tsx ---- */
export const CONTENT: any = {
  it: { NAV_LINKS: [] },
  en: { NAV_LINKS, nav: NAV_LINKS, links: NAV_LINKS },
  ar: { NAV_LINKS, nav: NAV_LINKS, links: NAV_LINKS },
};

export function getLocaleFromPath(path: string): "it" | "en" | "ar" {
  try {
    if (path?.startsWith("/ar")) return "ar";
    if (path?.startsWith("/en")) return "en";
  } catch (_) {}
  return "it";
}
