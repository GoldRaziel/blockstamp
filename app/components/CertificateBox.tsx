"use client";
import React from "react";

type Props = { locale: "it" | "en" | "ar" };

export default function CertificateBox({ locale }: Props) {
  const t = {
    it: {
      title: "CERTIFICATO DI PROPRIETÀ",
      subtitle:
        "Genera il tuo Certificato di Proprietà con valore probatorio, utile in sede giudiziaria e nelle controversie.",
      priceLabel: "Prezzo",
      price: "350 AED",
      cta: "ACQUISTA",
      dir: "ltr" as const,
    },
    en: {
      title: "OWNERSHIP CERTIFICATE",
      subtitle:
        "Generate your Ownership Certificate with evidentiary value, useful in court and legal disputes.",
      priceLabel: "Price",
      price: "350 AED",
      cta: "BUY NOW",
      dir: "ltr" as const,
    },
    ar: {
      title: "شهادة الملكية",
      subtitle:
        "أنشئ شهادة ملكية ذات قيمة إثباتية، مفيدة أمام المحاكم والنزاعات القانونية.",
      priceLabel: "السعر",
      price: "350 درهم",
      cta: "اشترِ الآن",
      dir: "rtl" as const,
    },
  }[locale];

  return (
    <section dir={t.dir} className="rounded-2xl bg-black/60 border border-white/10 p-6 shadow-lg backdrop-blur">
      <h3 className="text-xl font-semibold uppercase tracking-wide">{t.title}</h3>
      <p className="text-sm opacity-90 mt-2">{t.subtitle}</p>

      <div className="mt-5 flex items-center gap-4">
        <div className="text-base">
          <span className="opacity-80">{t.priceLabel}:</span>{" "}
          <strong className="text-white">{t.price}</strong>
        </div>

        <div className="ml-auto">
          <a
            href="/pay"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold"
          >
            {t.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
