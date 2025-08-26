import "../globals.css";
import Image from "next/image";
import LangDropdown from "../components/LangDropdown";

export const metadata = {
  title: "BLOCKSTAMP — إثبات الوجود",
  description: "طابع زمني عام وغير قابل للتغيير على بيتكوين."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-dvh bg-slate-950 text-slate-100">
        <div className="beam beam-header"></div>
        <header className="border-b border-white/10">
          <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex justify-start">
              <a href="/ar" className="flex items-center gap-3" aria-label="الصفحة الرئيسية">
                <Image src="/logo.png" alt="BLOCKSTAMP logo" width={1000} height={500}
                  priority sizes="(max-width: 768px) 200px, 400px"
                  className="h-auto max-h-14 md:max-h-20 w-auto origin-left md:scale-100 scale-[1.15]" />
              </a>
            </div>
            <nav className="text-sm flex items-center flex-wrap gap-x-3 gap-y-1">
              <a href="/ar#procedure" className="hover:underline whitespace-nowrap">الإجراء</a>
              <span className="opacity-50">•</span>
              <a href="/ar#pricing" className="hover:underline whitespace-nowrap">الأسعار</a>
              <span className="opacity-50">•</span>
              <a href="/ar#guide" className="hover:underline whitespace-nowrap">الدليل</a>
              <span className="opacity-50">•</span>
              <a href="/ar#contact" className="hover:underline whitespace-nowrap">اتصل بنا</a>
              <span className="opacity-50">•</span>
              <LangDropdown />
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-white/10 mt-10">
          <div className="container mx-auto px-4 py-6 flex items-center justify-between text-sm opacity-80">
            <span>© {year} BLOCKSTAMP — Proof of Existence</span>
            <span className="hidden sm:inline">•</span>
            <a href="mailto:blockstamp.protection@gmail.com" className="hover:text-sky-400 transition">
              blockstamp.protection@gmail.com
            </a>
          </div>
        </footer>
        <div className="beam beam-footer"></div>
      </body>
    </html>
  );
}
