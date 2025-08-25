export const CONTENT_HERO: any = {
  title: "Bitcoin Timestamping made simple",
  subtitle:
    "Upload your file, pay securely, and get a verifiable Bitcoin proof (.ots). Private. Fast. Reliable.",
  ctaPrimary: "Stamp Now",
  ctaSecondary: "How it works",
};

export const NAV_LINKS: any[] = [
  { href: "/en#how", label: "Procedure" },
  { href: "/en#price", label: "Price" },
  { href: "/en#verify", label: "Verify" },
  { href: "/en#faq", label: "FAQ" },
  { href: "/en#contact", label: "Contact" },
];

export const PRICE_BOX: any = {
  title: "Price",
  points: [
    "One-time payment, VAT included.",
    "Download your .ots file and keep it with your original zip.",
    "On-chain confirmation 48–72h (typical).",
    "You can verify your Block Height anytime in the VERIFICATION section.",
  ],
  button: "Pay now",
};

export const VERIFY_BOX: any = {
  title: "Verification",
  intro:
    "Upload your .ots file below and click VERIFY. You will get your Block Height registered on Bitcoin.",
  helper:
    "Hashing happens in your browser. Your file never leaves your device.",
  action: "Verify",
  resultLabel: "Block Height",
};

export const PAY_TEXTS: any = {
  payNow: "Pay now",
  payToUnlock: "Make the payment to unlock STAMP",
  paidSuccess: "Payment received. You can now STAMP.",
};

export const LANG_DROPDOWN: any = {
  label: "Language",
  it: "Italiano",
  en: "English",
  ar: "العربية",
};

export const MISC: any = {
  chooseFile: "Choose file",
  stamp: "Stamp",
  or: "or",
};

export const STRINGS: any = {};
/* ---- compatibility exports for NavLinks.tsx ---- */
export const CONTENT: any = {
  it: { NAV_LINKS: [] },
  en: { NAV_LINKS, nav: NAV_LINKS, links: NAV_LINKS },
  ar: { NAV_LINKS, nav: NAV_LINKS, links: NAV_LINKS },
};

export function getLocaleFromPath(path: string): "it" | "en" | "ar" {
  try {
    if (path?.startsWith("/ar")) return "ar";
    if (path?.startsWith("/en")) return "en";
  } catch (_) {}
  return "it";
}
