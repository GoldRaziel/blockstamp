"use client";
import NavLinks from "./NavLinks";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-black/30">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
        <a href="/ar" className="font-bold tracking-wide">BLOCKSTAMP</a>
        <div className="flex items-center gap-6">
          <NavLinks />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
