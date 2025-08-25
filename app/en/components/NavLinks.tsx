"use client";
import {usePathname} from "next/navigation";
import {CONTENT, getLocaleFromPath} from "../lib/content";

export default function NavLinks() {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPath(pathname);
  const t = CONTENT[locale].nav;

  return (
    <>
      <a href="/#procedura" className="hover:underline whitespace-nowrap">{t.procedura}</a>
      <span className="opacity-50">•</span>
      <a href="/#guida" className="hover:underline whitespace-nowrap">{t.guida}</a>
      <span className="opacity-50">•</span>
      <a href="/#pricing" className="hover:underline whitespace-nowrap">{t.prezzo}</a>
      <a href="/#faq" className="hover:underline whitespace-nowrap">{t.faq}</a>
      <span className="opacity-50">•</span>
      <a href="/#contatti" className="hover:underline whitespace-nowrap">{t.contatti}</a>
    </>
  );
}
