"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LangDropdown from "./LangDropdown";

type Locale = "it" | "en" | "ar";

const LABELS: Record<Locale, {
  procedure: string; guide: string; service: string; faq: string; contact: string;
  ids: { procedure: string; guide: string; faq: string; contact: string; };
}> = {
  it: {
    procedure: "PROCEDURA", guide: "GUIDA", service: "SERVIZI", faq: "FAQ", contact: "CONTATTI",
    ids: { procedure: "procedura", guide: "guida", faq: "faq", contact: "contatti" }
  },
  en: {
    procedure: "PROCEDURE", guide: "GUIDE", service: "SERVICE", faq: "FAQ", contact: "CONTACT",
    ids: { procedure: "procedure", guide: "guide", faq: "faq", contact: "contact" }
  },
  ar: {
    procedure: "الإجراء", guide: "الدليل", service: "الخدمات", faq: "الأسئلة الشائعة", contact: "اتصل بنا",
    ids: { procedure: "procedure", guide: "guide", faq: "faq", contact: "contact" }
  }
};

export default function Nav() {
  const pathname = usePathname() || "/";
  const seg1 = pathname.split("/")[1];
  const locale: Locale = seg1 === "en" ? "en" : seg1 === "ar" ? "ar" : "it";
  const base = locale === "it" ? "" : `/${locale}`;
    const homeBase = locale === "it" ? "/" : base;
  const t = LABELS[locale];
  const dir = locale === "ar" ? "rtl" : undefined;
  const isHome = (pathname || "/").replace(/\/+$/, "") === (base || "");
  const hashBase = locale === "it" ? (isHome ? "" : "/") : base;

  return (
    <nav className="text-sm flex items-center flex-wrap gap-x-3 gap-y-1" dir={dir}>
  <Link href={`${homeBase}#${t.ids.procedure}`} className="hover:underline whitespace-nowrap">{t.procedure}</Link>
  <span className="opacity-50">•</span>
    <a href={`${homeBase}#${t.ids.guide}`} onClick={(e) => { if (locale === "ar" && window.location.pathname.replace(/\/+\$/, "") === base.replace(/\/+\$/, "")) { e.preventDefault(); const el = document.getElementById(t.ids.guide); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); } }} className="hover:underline whitespace-nowrap">{t.guide}</a>
  <span className="opacity-50">•</span>
  <Link href={`${base}/service`} className="hover:underline whitespace-nowrap">{t.service}</Link>
  <span className="opacity-50">•</span>
  <Link href={`${homeBase}#${t.ids.faq}`} className="hover:underline whitespace-nowrap">{t.faq}</Link>
  <span className="opacity-50">•</span>
  <Link href={`${homeBase}#${t.ids.contact}`} className="hover:underline whitespace-nowrap">{t.contact}</Link>
  <LangDropdown />
</nav>

  );
}
