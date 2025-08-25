"use client";
import {useState, useEffect, useRef} from "react";
import {usePathname} from "next/navigation";

type Opt = {code:"it"|"en"|"ar"; label:string; flag:string};
const OPTIONS: Opt[] = [
  {code: "it", label: "Italiano", flag: "🇮🇹"},
  {code: "en", label: "English",  flag: "🇬🇧"},
  {code: "ar", label: "العربية",   flag: "🇦🇪"}
];

export default function LangDropdown() {
  const pathname = usePathname() || "/";
  const current = (pathname.split("/")[1] as Opt["code"]) || "it";
  const selected = OPTIONS.find(o => o.code === current) || OPTIONS[0];

  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(t) && btnRef.current && !btnRef.current.contains(t)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  function hrefFor(code: Opt["code"]) {
    // Semplice: portiamo sempre alla home della lingua
    return `/${code}`;
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition text-sm"
        title="Language"
      >
        <span className="text-lg">{selected.flag}</span>
        <span className="hidden sm:inline">{selected.label}</span>
        <svg width="14" height="14" viewBox="0 0 20 20" className="opacity-80"><path fill="currentColor" d="M5.5 7.5L10 12l4.5-4.5"></path></svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-44 rounded-xl border border-white/15 bg-black/70 backdrop-blur p-1 shadow-lg z-50"
          role="listbox"
        >
          {OPTIONS.map(o => (
            <a
              key={o.code}
              href={hrefFor(o.code)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 ${o.code===selected.code ? "bg-white/5" : ""}`}
              role="option"
              aria-selected={o.code===selected.code}
              onClick={() => setOpen(false)}
            >
              <span className="text-lg">{o.flag}</span>
              <span className="text-sm">{o.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
