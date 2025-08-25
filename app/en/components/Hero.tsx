"use client";
import { CONTENT_HERO } from "../lib/content";

export default function Hero() {
  return (
    <section id="hero" className="py-10 md:py-14">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          {CONTENT_HERO.title}
        </h1>
        <p className="text-base md:text-lg opacity-90">
          {CONTENT_HERO.subtitle}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <a href="#how" className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold">
            {CONTENT_HERO.ctaPrimary}
          </a>
          <a href="#how" className="px-4 py-2 rounded-xl border border-white/20 hover:border-white/40">
            {CONTENT_HERO.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
