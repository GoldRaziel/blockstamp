"use client";

import { usePathname } from "next/navigation";
import { CONTENT_HERO } from "../../lib/content";

type Locale = "it" | "en" | "ar";

export default function Hero() {
  const pathname = usePathname() || "/";
  const seg = (pathname.split("/")[1] || "en") as Locale;
  const locale: Locale = (["it", "en", "ar"] as const).includes(seg) ? seg : "en";
  const t = CONTENT_HERO[locale];

  // RTL per arabo
  const isRTL = locale === "ar";

  return (
    <section
      className={`relative mx-auto max-w-5xl px-4 py-10 sm:py-14 ${isRTL ? "text-right" : "text-left"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
          {t.title}
        </h1>
        <p className="text-base sm:text-lg text-white/80 max-w-3xl">
          {t.subtitle}
        </p>
        <div className={`mt-6 flex gap-3 ${isRTL ? "justify-end" : "justify-start"} flex-wrap`}>
          <a
            href={t.primaryHref}
            className="inline-flex items-center rounded-xl px-5 py-2.5 font-medium bg-amber-400 hover:bg-amber-300 text-black transition"
          >
            {t.primaryCta}
          </a>
          <a
            href={t.secondaryHref}
            className="inline-flex items-center rounded-xl px-5 py-2.5 font-medium border border-white/20 hover:border-white/40 text-white"
          >
            {t.secondaryCta}
          </a>
        </div>
      </div>
    </section>
  );
}
