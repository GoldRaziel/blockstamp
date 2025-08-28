// app/components/LangDropdown.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Locale = "it" | "en" | "ar";

const FLAGS: Record<Locale, string> = {
  it: "/flags/it.svg",
  en: "/flags/gb.svg",
  ar: "/flags/ae.svg",
};

const LABELS: Record<Locale, string> = {
  it: "Italiano",
  en: "English",
  ar: "العربية",
};

interface Props {
  /** es. "/portal" → link: /portal, /en/portal, /ar/portal  */
  basePath?: `/${string}`;
  /** se true, preserva ?session_id=... nei link */
  keepSessionId?: boolean;
  className?: string;
}

export default function LangDropdown({ basePath = "/", keepSessionId = false, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [sid, setSid] = useState<string | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const current: Locale = useMemo(() => {
    if (typeof window === "undefined") return "it";
    const seg1 = window.location.pathname.split("/")[1];
    return seg1 === "en" || seg1 === "ar" ? (seg1 as Locale) : "it";
  }, []);

  useEffect(() => {
    if (!keepSessionId) return;
    try {
      const sp = new URLSearchParams(window.location.search);
      setSid(sp.get("session_id"));
    } catch {}
  }, [keepSessionId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current && btnRef.current) {
        if (!menuRef.current.contains(t) && !btnRef.current.contains(t)) setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  // Costruzione href: IT = senza /it
  const hrefFor = (loc: Locale) => {
    const base = loc === "it" ? basePath : `/${loc}${basePath === "/" ? "" : basePath}`;
    const norm = (base === "/" ? "/" : base.replace(/\/{2,}/g, "/").replace(/\/+$/, "") || "/");
    return sid ? `${norm}?session_id=${encodeURIComponent(sid)}` : norm;
  };

  return (
    <div className={`relative text-sm ${className}`} dir="ltr">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-sky-100"
        title="Language"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <img src={FLAGS[current]} alt={LABELS[current]} className="h-4 w-6 rounded-sm" />
        <span className="hidden sm:inline">{LABELS[current]}</span>
        <span className="opacity-80">▼</span>
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 z-10 mt-2 w-44 rounded-md bg-black/70 border border-white/10 shadow-lg backdrop-blur"
          role="menu"
        >
          {(["it","en","ar"] as Locale[]).map(loc => (
            <a key={loc} href={hrefFor(loc)} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 text-sky-100" role="menuitem">
              <img src={FLAGS[loc]} alt={LABELS[loc]} className="h-4 w-6 rounded-sm" />
              <span>{LABELS[loc]}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
