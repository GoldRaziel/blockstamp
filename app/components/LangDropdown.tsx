"use client";

import {useEffect, useState} from "react";
import Link from "next/link";

/**
 * LangDropdown — compatibile con App Router senza i18n di Next.
 * Regole:
 *  - IT = lingua di default → NESSUN prefisso (/)
 *  - EN/AR → prefisso /en, /ar
 *  - Mantiene il path corrente (senza duplicare o perdere segmenti)
 */
export default function LangDropdown() {
  const [rest, setRest] = useState<string>("/");
  const [ready, setReady] = useState(false);

  useEffect(() => {
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
      }
      if (p === "") p = "/";
    } catch {}
    setRest(p);
    setReady(true);
  }, []);

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
    </div>
  );
}
