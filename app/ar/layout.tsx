import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حماية حقوق الملكية الفكرية عبر البلوك تشين | Blockstamp",
  description: "ختم زمني على بيتكوين لحماية الأعمال والأفكار والملفات: إثبات وجود، تحقق علني، وشهادة قابلة للتنزيل. بسيط وفعّال.",
  alternates: { canonical: "https://blockstamp.ae/ar" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "حماية حقوق الملكية الفكرية عبر البلوك تشين | Blockstamp",
    description: "ختم زمني على بيتكوين لحماية الأعمال والأفكار والملفات: إثبات وجود، تحقق علني، وشهادة قابلة للتنزيل. بسيط وفعّال.",
    url: "https://blockstamp.ae/ar",
    type: "website"
  }
};

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
