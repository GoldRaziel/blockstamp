"use client";
import { NAV_LINKS } from "../lib/content";

export default function NavLinks() {
  return (
    <nav className="hidden md:flex items-center gap-4">
      {NAV_LINKS.map((l) => (
        <a key={l.href} href={l.href} className="opacity-90 hover:opacity-100">
          {l.label}
        </a>
      ))}
    </nav>
  );
}
