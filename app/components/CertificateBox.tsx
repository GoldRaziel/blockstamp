"use client";
import React from "react";

type Props = { locale: "it" | "en" | "ar" };

export default function CertificateBox({ locale }: Props) {
  const t = {
    it: {
      title: "CERTIFICATO DI PROPRIETA'",
      subtitle:
        "Certifica la titolarità della tua opera con valore probatorio, utile in giudizio e nelle controversie.",
      priceLabel: "Prezzo",
      price: "350 AED",
      howToTitle: "Come fare",
      howTo: [
        "Scrivici un'email a: blockstamp.protection@gmail.com",
        "Oggetto: Richiesta di Certificato di Proprietà",
        "Inserisci: Nome, Cognome, Data di nascita, Indirizzo di residenza del titolare del diritto",
        "Indica: il numero di blocco Bitcoin, il codice SHA256 ottenuto dalla nostra HOME e il codice ottenuto in fase di timbratura su blockchain",
        "Dopo la verifica, riceverai un link per pagare 350 AED",
        "Solo dopo la registrazione del pagamento genereremo il Certificato e lo invieremo all'email usata per la richiesta",
      ],
      noteStrong: "Nota bene:",
      note:
        "Il certificato è un documento ufficiale: conservalo con la massima attenzione. In caso di controversie legali attesta la titolarità del diritto registrato. La generazione del certificato può richiedere fino a 48 ore.",
      dir: "ltr" as const,
    },
    en: {
      title: "OWNERSHIP CERTIFICATE",
      subtitle:
        "Certify ownership of your work with evidentiary value, valid in court and legal disputes.",
      priceLabel: "Price",
      price: "350 AED",
      howToTitle: "How to proceed",
      howTo: [
        "Email us at: blockstamp.protection@gmail.com",
        "Subject: Ownership Certificate Request",
        "Include: Full name, Date of birth, Residential address of the IP owner",
        "Provide: the Bitcoin block number, the SHA256 code obtained from our HOME, and the code issued during the blockchain timestamping",
        "After verification, you will receive a link to pay 350 AED",
        "Only after payment is recorded, we will generate the Certificate and send it to the email you used for the request",
      ],
      noteStrong: "Please note:",
      note:
        "The certificate is an official document: keep it safe. In legal disputes, it proves the registered ownership. Certificate generation may take up to 48 hours.",
      dir: "ltr" as const,
    },
    ar: {
      title: "شهادة الملكية",
      subtitle:
        "ثبّت ملكيتك لعملك بقيمة إثباتية صالحة أمام المحاكم والنزاعات القانونية.",
      priceLabel: "السعر",
      price: "350 درهم",
      howToTitle: "كيفية الطلب",
      howTo: [
        "راسلنا عبر البريد: blockstamp.protection@gmail.com",
        "الموضوع: طلب شهادة ملكية",
        "أدرج: الاسم الكامل، تاريخ الميلاد، عنوان السكن لصاحب الحق",
        "زوّدنا: برقم بلوك بيتكوين، ورمز SHA256 المُستخرج من صفحة HOME لدينا، والرمز المُستلم أثناء ختم البلوكشين",
        "بعد المراجعة ستتلقى رابط الدفع بقيمة 350 درهم",
        "بعد تسجيل الدفع فقط، سنصدر الشهادة ونرسلها إلى البريد الإلكتروني المستخدم في الطلب",
      ],
      noteStrong: "تنبيه:",
      note:
        "الشهادة وثيقة رسمية ويجب حفظها بعناية. في حال النزاعات القانونية تثبت الملكية المسجلة. قد يستغرق إصدار الشهادة حتى 48 ساعة.",
      dir: "rtl" as const,
    },
  }[locale];

  return (
    <section
      dir={t.dir}
      className="rounded-2xl bg-black/60 border border-white/10 p-6 shadow-lg backdrop-blur"
    >
      <h3 className="text-xl font-semibold uppercase tracking-wide text-[#00ccff]">
        {t.title}
      </h3>
      <p className="text-sm opacity-90 mt-2">{t.subtitle}</p>

      <div className="mt-5 flex items-center gap-4">
        <div className="text-base">
          <span className="opacity-80">{t.priceLabel}:</span>{" "}
          <strong className="text-white">{t.price}</strong>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold opacity-90">{t.howToTitle}</h4>
        <ul className="mt-2 list-disc ps-6 space-y-1 text-sm opacity-90">
          {t.howTo.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>

      <p className="text-xs opacity-70 mt-5">
        <strong className="opacity-90">{t.noteStrong}</strong> {t.note}
      </p>
    </section>
  );
}
