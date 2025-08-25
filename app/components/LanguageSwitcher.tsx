"use client";

import { usePathname } from "next/navigation";

function swapLocale(pathname: string, to: "it"|"en"|"ar") {
  const parts = pathname.split("/");
  // parts[0] = "" (leading slash), parts[1] is maybe locale
  if (["it","en","ar"].includes(parts[1])) {
    parts[1] = to;
  } else {
    parts.splice(1, 0, to); // insert after leading slash
  }
  return parts.join("/") || `/${to}`;
}

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const hash = typeof window !== "undefined" ? window.location.hash : "";

  const toIt = swapLocale(pathname, "it") + hash;
  const toEn = swapLocale(pathname, "en") + hash;
  const toAr = swapLocale(pathname, "ar") + hash;

  return (
    <div className="flex items-center gap-2 text-sm">
      <a href={toIt} className="opacity-80 hover:opacity-100">IT</a>
      <span className="opacity-30">|</span>
      <a href={toEn} className="opacity-80 hover:opacity-100">EN</a>
      <span className="opacity-30">|</span>
      <a href={toAr} className="opacity-80 hover:opacity-100">AR</a>
    </div>
  );
}
