"use client";

import { useRef, useState, useEffect } from "react";

export default function PortalPage() {
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [receiptCode, setReceiptCode] = useState<string>("");
  const [locked, setLocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // قائمة اللغة (Dropdown) — تحفظ session_id في الروابط
  function LanguageDropdown() {
    const [sid, setSid] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
      try {
        const sp = new URLSearchParams(window.location.search);
        setSid(sp.get("session_id"));
      } catch {}
    }, []);

    const hrefFor = (loc: "it" | "en" | "ar") =>
      `/${loc}/portal${sid ? `?session_id=${encodeURIComponent(sid)}` : ""}`;

    return (
      <div className="beam beam-hero relative text-sm" dir="ltr">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-sky-100"
        >
          <span>🌐 اللغة</span>
          <span className="opacity-80">▼</span>
        </button>

        {open && (
          <div className="absolute right-0 z-10 mt-2 w-44 rounded-md bg-black/70 border border-white/10 shadow-lg backdrop-blur">
            <a href={hrefFor("it")} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10">
              <span>🇮🇹</span><span>الإيطالية</span>
            </a>
            <a href={hrefFor("en")} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10">
              <span>🇬🇧</span><span>الإنجليزية</span>
            </a>
            <a href={hrefFor("ar")} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10">
              <span>🇦🇪</span><span>العربية</span>
            </a>
          </div>
        )}
      </div>
    );
  }

  // مثبّت: عند الوصول بـ ?session_id نؤكد ثم نحذف الاستعلام فقط (ونبقي على المسار/اللغة الحالية)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const sid = sp.get("session_id");
    if (sid) {
      fetch(`/api/confirm?session_id=${encodeURIComponent(sid)}`, {
        cache: "no-store",
        credentials: "include", // << مهم: أرسل الكوكيز
      }).finally(() => {
        // أبقِ /ar/portal (أو المسار الحالي) واحذف الاستعلام فقط
        history.replaceState({}, "", window.location.pathname);
      });
    }
  }, []);

  async function handleStamp() {
    setError("");
    setReceiptCode("");

    if (!zipFile) { setError("يرجى اختيار ملف ‎.zip أولًا."); return; }
    if (!zipFile.name.toLowerCase().endsWith(".zip")) { setError("مسموح فقط بتحميل ملفات ‎.zip."); return; }

    try {
      setBusy(true);
      const fd = new FormData();
      fd.append("zip", zipFile);

      // نُجبر إرسال اللغة "ar" للـ API
      const res = await fetch("/api/stamp", {
        method: "POST",
        credentials: "include",             // أرسل الكوكيز
        headers: { "x-locale": "ar" },      // أجبر اللغة العربية (السيرفر سيعرض EN لهذه الرسالة كما اتفقنا)
        body: fd,
        cache: "no-store",
      });
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const code = res.headers.get("x-receipt-code") || "";
      setReceiptCode(code);
      setLocked(true);

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "blockstamp_receipt.ots";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (e: any) {
      setError(e.message || "خطأ غير متوقع.");
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    try {
      if (!receiptCode) return;
      await navigator.clipboard.writeText(receiptCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="beam beam-hero max-w-3xl mx-auto pt-6 pb-24" dir="rtl">
      {/* شريط علوي: الشعار (يسار بصريًا) + قائمة اللغة (يمين) */}
      <div className="mb-6 flex items-center justify-between" dir="ltr">
        {/* الشعار — غير قابل للنقر */}
        <img
          src="/logo.png"
          width="1000"
          height="500"
          alt="Blockstamp"
          className="h-auto max-h-14 md:max-h-20 w-auto origin-left md:scale-100 scale-[1.15] select-none pointer-events-none"
        />
        {/* قائمة اللغة على اليمين */}
        <LanguageDropdown />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-sky-100 mb-6" dir="rtl">
        منطقة محمية: ارفع ملف ‎.zip واطبع الختم
      </h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
<p className="text-sm leading-relaxed space-y-2 mb-1">
  <strong>التعليمات:</strong>{' '}
</p>
<ul className="list-disc list-inside text-sky-100 space-y-1">
  <li>في ملف <strong>.zip</strong> الذي أنشأته مسبقًا، ضع ملف نصي <strong>(.txt)</strong> يحتوي على كود <strong>SHA256</strong> المولد من صفحة <strong>الرئيسية</strong>.</li>
  <li>قم بتحميل ملف <strong>.zip</strong> أدناه.</li>
  <li>ستحصل على ملف <strong>.ots</strong> كدليل على التسجيل.</li>
  <li>احفظ ملف <strong>.ots</strong> داخل المجلد الذي يحتوي على ملف <strong>.zip</strong>.</li>
  <li>احفظ في ملف نصي آخر <strong>(.txt)</strong> <strong>رمز الختم</strong> الذي سيتم إنشاؤه أدناه وضعه في المجلد الذي يحتوي على ملف <strong>.zip</strong>.</li>
  <li>بعد <strong>48–72</strong> ساعة، قم بتحميل ملف <strong>.ots</strong> في قسم <strong>VERIFY</strong> من صفحتنا الرئيسية.</li>
  <li>ستتلقى <strong>رقم الكتلة</strong> في سلسلة بلوكشين بيتكوين.</li>
  <li>أنشئ <strong>شهادة الملكية</strong> الخاصة بك واحتفظ بها بأمان.</li>
</ul>
<p className="text-xs opacity-80 mt-2">
  ملاحظة: في <em>VERIFY</em> يجب تحميل <strong>ملف .ots</strong>. أما <strong>رمز الختم</strong> فهو مرجع داخلي لاسترجاع العملية.
</p>

        {/* السطر LTR لعناصر الرفع والطباعة */}
        <div className="flex items-start gap-3" dir="ltr">
          {/* input مخفي */}
          <input
            ref={inputRef}
            id="file-ar"
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(e) => setZipFile(e.target.files?.[0] || null)}
          />

          {/* زر اختر ملف + اسم الملف تحت */}
          <div className="flex flex-col">
            <label
              htmlFor="file-ar"
              className="px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-300 text-black font-semibold cursor-pointer"
            >
              اختر ملف
            </label>

            {/* اسم الملف المحدد */}
            {zipFile && (
              <div className="mt-2 text-sky-200 text-sm" dir="rtl">
                {zipFile.name}
              </div>
            )}
          </div>

          {/* زر الطباعة على البلوكتشين */}
          <button
            onClick={handleStamp}
            disabled={busy || locked}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold disabled:opacity-50"
          >
            {busy ? "جارٍ المعالجة..." : "الطباعة على البلوكتشين"}
          </button>
        </div>

        {error && <div className="mt-2 text-red-300 text-sm" dir="rtl">{error}</div>}
      </div>

      <div className="mt-8 bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-3">
        <h2 className="font-semibold text-sky-200" dir="rtl">سيظهر ختمك هنا:</h2>
        <div className="flex items-center gap-3" dir="ltr">
          <div className="flex-1">
            <div className="text-sky-300 break-all text-sm bg-black/20 rounded-md px-3 py-2 min-h-[2.5rem]">
              {receiptCode ? receiptCode : "\u2014 بانتظار التوليد \u2014"}
            </div>
          </div>
          <button
            onClick={handleCopy}
            disabled={!receiptCode}
            className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold disabled:opacity-50"
          >
            نسخ
          </button>
        </div>
        {copied && <div className="text-xs text-sky-400" dir="rtl">تم النسخ إلى الحافظة \u2705</div>}
      </div>

      {/* إخفاء عناصر الترويسة/التنقل الموروثة */}
      <style jsx global>{`
        header, nav { display: none !important; }
      `}</style>
    </div>
  );
}
