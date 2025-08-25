"use client";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const base = pathname.replace(/^\/(en|ar)(?=\/|$)/, ""); // rimuove prefisso en/ar se presente

  const links = [
    { href: "/" + base.replace(/^\/+/, ""), code: "IT" },
    { href: "/en" + base, code: "EN" },
    { href: "/ar" + base, code: "AR" },
  ];

  return (
    <div className="flex items-center gap-2 text-sm">
      {links.map((l, i) => (
        <a key={i} href={l.href} className="px-2 py-1 rounded hover:bg-white/10">
          {l.code}
        </a>
      ))}
    </div>
  );
}
