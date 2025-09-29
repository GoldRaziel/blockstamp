"use client";

import { useEffect, useState } from "react";

/**
 * LangDropdown — versione minimale e robusta.
 * Regole:
 *  - EN = lingua di default → NESSUN prefisso (/)
 *  - IT/AR → prefisso /it, /ar
 * Nota: usa <a href> + onClick con location.assign per evitare qualsiasi problema di click ignorato in HOME.
 */
export default function LangDropdown() {
  const [rest, setRest] = useState<string>("/");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let p = "/";
    try {
      p = window.location.pathname || "/";
      // Se la path inizia con /en o /it o /ar, rimuovi il prefisso locale
      const m = p.match(/^\/(en|it|ar)(?=\/|$)/);
      if (m) {
        p = p.slice(m[0].length);
        if (!p.startsWith("/")) p = "/" + p;
      }
      if (p === "") p = "/";
    } catch {}
    setRest(p);
    setReady(true);
  }, []);

  if (!ready) return null;

  const hrefFor = (loc: "en" | "it" | "ar") => {
    if (loc === "en") return rest === "" ? "/" : rest || "/";
    return `/${loc}${rest === "/" ? "" : rest}`;
  };

  const go = (loc: "en" | "it" | "ar") => (e: React.MouseEvent<HTMLAnchorElement>) => {
    // forza la navigazione per evitare problemi di click ignorato
    e.preventDefault();
    const href = hrefFor(loc);
    window.location.assign(href);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-3 text-sm">
        <span className="opacity-80">🌐</span>
        <a href={hrefFor("en")} onClick={go("en")} aria-label="English">EN</a>
        <span className="opacity-40">|</span>
        <a href={hrefFor("it")} onClick={go("it")} aria-label="Italiano">IT</a>
        <span className="opacity-40">|</span>
        <a href={hrefFor("ar")} onClick={go("ar")} aria-label="العربية">AR</a>
      </div>
    </div>
  );
}
