"use client";
import {useState, useEffect, useRef} from "react";
import {usePathname} from "next/navigation";

type Code = "it" | "en" | "ar";
const FLAGS: Record<Code, string> = {
  it: "/flags/it.svg",
  en: "/flags/gb.svg",
  ar: "/flags/ae.svg"
};

export default function LangDropdown() {
  const pathname = usePathname() || "/";
  const current = (pathname.split("/")[1] as Code) || "it";
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
            <a
              key={code}
              href={hrefFor(code)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/10 text-white ${code===current ? "opacity-100" : "opacity-90"}`}
              role="option"
              aria-selected={code===current}
              onClick={() => setOpen(false)}
            >
              <img src={FLAGS[code]} width="18" height="12" alt={code} className="inline-block rounded-[2px]" />
              <span className="text-sm leading-none uppercase">{code}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
