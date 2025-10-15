import GAds from "../components/GAds";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intellectual property protection with blockchain | Blockstamp",
  description: "Bitcoin timestamp to protect works, ideas and documents: proof of existence, public verification and a downloadable certificate. Simple and reliable.",
  alternates: { canonical: "https://blockstamp.ae/en" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Intellectual property protection with blockchain | Blockstamp",
    description: "Bitcoin timestamp to protect works, ideas and documents: proof of existence, public verification and a downloadable certificate. Simple and reliable.",
    url: "https://blockstamp.ae/en",
    type: "website"
  }
};

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
