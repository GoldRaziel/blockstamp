"use client";
import {useState, useEffect, useRef} from "react";
import {usePathname} from "next/navigation";

type Code = "it" | "en" | "ar";
const OPTIONS: {code: Code; flag: string}[] = [
  {code: "it", flag: "🇮🇹"},
  {code: "en", flag: "🇬🇧"},
  {code: "ar", flag: "🇦🇪"}
];

export default function LangDropdown() {
  const pathname = usePathname() || "/";
  const current = (pathname.split("/")[1] as Code) || "it";
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

  function hrefFor(code: Code) {
    return `/${code}`;
  }

  return (
    <div className="relative">
      {/* trigger: solo bandierina + codice (bianco), zero box */}
      <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-1 text-white hover:underline"
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Language"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="text-sm leading-none uppercase">{selected.code.toUpperCase()}</span>
        <svg width="12" height="12" viewBox="0 0 20 20" className="opacity-80"><path fill="currentColor" d="M5 7l5 5 5-5"/></svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-24 rounded-md bg-black/80 border border-white/10 backdrop-blur p-1 shadow-lg z-50"
          role="listbox"
        >
          {OPTIONS.map(o => (
            <a
              key={o.code}
              href={hrefFor(o.code)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded hover:bg-white/10 text-white ${o.code===selected.code ? "opacity-100" : "opacity-90"}`}
              role="option"
              aria-selected={o.code===selected.code}
              onClick={() => setOpen(false)}
            >
              <span className="text-base leading-none">{o.flag}</span>
              <span className="text-sm leading-none uppercase">{o.code.toUpperCase()}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
