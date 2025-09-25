// app/components/LangDropdown.tsx (robust locale handling)
"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Code = "it" | "en" | "ar";
const LOCALES: Code[] = ["it", "en", "ar"];
const FLAGS: Record<Code, string> = {
  it: "/flags/it.svg",
  en: "/flags/gb.svg",
  ar: "/flags/ae.svg",
};

export default function LangDropdown() {
  const pathname = (usePathname() || "/").replace(/\/+$/, "") || "/";
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  // 1) Locale corrente: valido solo se il primo segmento è fra quelli supportati
  const seg1 = pathname.split("/")[1] || "";
  const isLocale = (seg1 === "it" || seg1 === "en" || seg1 === "ar");
  const current: Code = (isLocale ? (seg1 as Code) : "it");

  // 2) Resto del path (pagina corrente) senza prefisso locale
  const restPath = isLocale ? ("/" + pathname.split("/").slice(2).join("/")) || "/" : pathname;

  // 3) Costruisci href per ciascuna lingua preservando la pagina
  function hrefFor(code: Code): string {
    // Italiano: NO prefisso
    if (code === "it") {
      return restPath === "" ? "/" : restPath;
    }
    // en/ar: prefisso locale
    return `/${code}${restPath === "/" ? "" : restPath}`;
  }

  // Chiudi menu su click esterno/escape
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!btnRef.current) return;
      if (!btnRef.current.closest(".lang-dd-root")) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative lang-dd-root">
      {/* Trigger: bandierina + codice */}
      <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-2 px-2 py-1"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Image src={FLAGS[current]} alt={current} width={20} height={14} />
        <span className="uppercase">{current}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-2 w-44 rounded-md bg-black/70 border border-white/10 shadow-lg backdrop-blur"
        >
          <a href={hrefFor("it")} role="menuitem" className="flex items-center gap-2 px-3 py-2 hover:bg-white/10">
            <Image src={FLAGS.it} alt="it" width={20} height={14} /><span>Italiano</span>
          </a>
          <a href={hrefFor("en")} role="menuitem" className="flex items-center gap-2 px-3 py-2 hover:bg-white/10">
            <Image src={FLAGS.en} alt="en" width={20} height={14} /><span>English</span>
          </a>
          <a href={hrefFor("ar")} role="menuitem" className="flex items-center gap-2 px-3 py-2 hover:bg-white/10">
            <Image src={FLAGS.ar} alt="ar" width={20} height={14} /><span>العربية</span>
          </a>
        </div>
      )}
    </div>
  );
}
