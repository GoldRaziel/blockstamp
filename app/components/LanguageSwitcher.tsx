"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  // Normalizza alla root della lingua
  const base = pathname.startsWith("/en") ? "/en"
              : pathname.startsWith("/ar") ? "/ar"
              : pathname.startsWith("/it") ? "/it"
              : "/it";
  return (
    <div className="flex items-center gap-2 text-sm">
      <Link href="/it" className={`px-2 py-1 rounded ${base==="/it"?"bg-white/20":"hover:bg-white/10"}`}>IT</Link>
      <Link href="/en" className={`px-2 py-1 rounded ${base==="/en"?"bg-white/20":"hover:bg-white/10"}`}>EN</Link>
      <Link href="/ar" className={`px-2 py-1 rounded ${base==="/ar"?"bg-white/20":"hover:bg-white/10"}`}>AR</Link>
    </div>
  );
}
