"use client";
import {useState, useEffect, useRef} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";

<<<<<<< HEAD
type Code = "it" | "en" | "ar";
const FLAGS: Record<Code, string> = {
  it: "/flags/it.svg",
  en: "/flags/gb.svg",
  ar: "/flags/ae.svg"
};

=======
import {useEffect, useState} from "react";
import Link from "next/link";

/**
 * LangDropdown — compatibile con App Router senza i18n di Next.
 * Regole:
 *  - IT = lingua di default → NESSUN prefisso (/)
 *  - EN/AR → prefisso /en, /ar
 *  - Mantiene il path corrente (senza duplicare o perdere segmenti)
 */
>>>>>>> parent of 162f86b (fix(i18n): EN come default (root), IT/AR con prefisso; selector robusto con navigazione forzata; typing service in Nav)
export default function LangDropdown() {
  const pathname = usePathname() || "/";
  const seg1 = (pathname.split("/")[1] || "");
  const current = (seg1==="it"||seg1==="en"||seg1==="ar") ? (seg1 as Code) : "it";
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
<<<<<<< HEAD
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(t) && btnRef.current && !btnRef.current.contains(t)) {
        setOpen(false);
=======
    // Esegue solo client-side
    let p = "/";
    try {
      p = window.location.pathname || "/";
      // Se la path inizia con /en o /it o /ar, rimuovi il prefisso locale
      const m = p.match(/^\/(en|it|ar)(?=\/|$)/);
      if (m) {
        // taglia il prefisso locale
        p = p.slice(m[0].length);
        if (!p.startsWith("/")) p = "/" + p;
>>>>>>> parent of 162f86b (fix(i18n): EN come default (root), IT/AR con prefisso; selector robusto con navigazione forzata; typing service in Nav)
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

<<<<<<< HEAD
    function hrefFor(code: Code) {
      // rileva primo segmento (se è lingua lo salta)
      const seg1 = (pathname.split("/")[1] || "");
      const isLocale = (seg1==="it"||seg1==="en"||seg1==="ar");
      const restPath = isLocale ? ("/" + pathname.split("/").slice(2).join("/")) : pathname;
      if (code === "it") return restPath || "/";
      return `/${code}${restPath === "/" ? "" : restPath}`;
    return `/${code}`;
  }

  return (
    <div className="relative">
      {/* Trigger minimal: bandierina + codice lingua (bianco), niente riquadro */}
      <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-1 text-white hover:underline"
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Language"
      >
        <img src={FLAGS[current]} width="18" height="12" alt={current} className="inline-block rounded-[2px]" />
        <span className="text-sm leading-none uppercase">{current}</span>
        <svg width="12" height="12" viewBox="0 0 20 20" className="opacity-80"><path fill="currentColor" d="M5 7l5 5 5-5"/></svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-28 rounded-md bg-black/80 border border-white/10 backdrop-blur p-1 shadow-lg z-50"
          role="listbox"
        >
          {(["it","en","ar"] as Code[]).map(code => (
            <Link href={hrefFor(code)} prefetch={false}
              key={code}
              
              className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 text-white ${code===current ? "opacity-100" : "opacity-90"}`}
              role="option"
              aria-selected={code===current}
              onClick={() => setOpen(false)}
            >
              <img src={FLAGS[code]} width="18" height="12" alt={code} className="inline-block rounded-[2px]" />
              <span className="text-sm leading-none uppercase">{code}</span>
            </Link>
          ))}
        </div>
      )}
=======
  if (!ready) return null;

  const hrefFor = (loc: "it" | "en" | "ar") => {
    // IT = root senza prefisso
    if (loc === "it") return rest === "" ? "/" : rest || "/";
    // EN/AR con prefisso e rest (evita //)
    return `/${loc}${rest === "/" ? "" : rest}`;
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 text-sm">
        <span className="opacity-80">🌐</span>
        {/* Link testuali: mantengono il path, cambiano solo la lingua */}
        <Link prefetch={false} href={hrefFor("it")} aria-label="Italiano">IT</Link>
        <span className="opacity-40">|</span>
        <Link prefetch={false} href={hrefFor("en")} aria-label="English">EN</Link>
        <span className="opacity-40">|</span>
        <Link prefetch={false} href={hrefFor("ar")} aria-label="العربية">AR</Link>
      </div>
>>>>>>> parent of 162f86b (fix(i18n): EN come default (root), IT/AR con prefisso; selector robusto con navigazione forzata; typing service in Nav)
    </div>
  );
}
