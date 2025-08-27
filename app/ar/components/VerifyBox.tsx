"use client";

import { useState } from "react";

export default function VerifyBox() {
  const [otsFile, setOtsFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [msgType, setMsgType] = useState<"ok" | "warn" | "error" | "">("");
  const [blockHeight, setBlockHeight] = useState<number | null>(null);

  function pickFile() {
    document.getElementById("otsPicker-ar")?.click();
  }

  async function handleVerify() {
    if (!otsFile || busy) return;
    setBusy(true);
    setMsg("");
    setMsgType("");
    setBlockHeight(null);

    try {
      const fd = new FormData();
      fd.append("ots", otsFile);

      const res = await fetch("/api/verify-ots", { method: "POST", body: fd });
      const txt = await res.text();

      let data: any = {};
      try { data = JSON.parse(txt); } catch { data = { raw: txt }; }

      if (!res.ok) {
        const raw = (data?.error || data?.raw || "").toString().toLowerCase();

        if (res.status === 404 || raw.includes("not found")) {
          setMsg("رمز غير موجود");
          setMsgType("warn");
          return;
        }

        setMsg("يُرجى الانتظار 48–72 ساعة قبل التحقق");
        setMsgType("warn");
        return;
      }

      const h = Number(
        data?.block_height ?? data?.blockHeight ?? data?.result?.block_height
      );
      if (Number.isFinite(h)) {
        setBlockHeight(h);
        setMsg("تم اكتمال التحقق.");
        setMsgType("ok");
      } else {
        setMsg("رمز غير موجود");
        setMsgType("warn");
      }
    } catch {
      setMsg("يُرجى الانتظار 48–72 ساعة قبل التحقق");
      setMsgType("warn");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      id="verify-ar"
      dir="rtl"
      className="mt-10 bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-4"
    >
      <h2 className="text-xl font-semibold text-white">تحقق</h2>

      <p className="text-sky-100 text-sm">
        قم بتحميل ملفك <code>.ots</code> أدناه ثم اضغط <strong>تحقق</strong>.{" "}
        ستحصل على <strong>رقم الكتلة</strong> المسجّل في سلسلة كتل البيتكوين.
      </p>

      <p className="text-sky-100 text-sm">
        <strong>ماذا يعني ذلك:</strong> الختم الزمني يحفظ البصمة الرقمية (SHA-256) لملفك
        على بيتكوين عبر مسار الإضافة (Merkle). يشير <em>ارتفاع الكتلة</em> إلى الكتلة
        التي تُثبّت دليلك. هذا يوفّر <strong>دليل وجود وأولوية زمنية</strong>:
        يثبت أن محتواك كان موجودًا على الأقل في تاريخ/وقت تلك الكتلة.{" "}
        <strong>احتفظ به: فهو دليلك التقني الذي يحميك قانونيًا.</strong>
      </p>

      <div className="flex items-center gap-3">
        <input
          id="otsPicker-ar"
          type="file"
          accept=".ots"
          className="hidden"
          onChange={(e) => setOtsFile(e.target.files?.[0] ?? null)}
        />

        {/* تحميل الملف = white */}
        <button
          type="button"
          onClick={pickFile}
          disabled={busy}
          className="px-4 py-2 rounded-xl font-semibold bg-white hover:bg-neutral-200 text-black disabled:opacity-60 disabled:cursor-not-allowed"
        >
          تحميل الملف
        </button>

        {/* تحقق = amber */}
        <button
          type="button"
          onClick={handleVerify}
          disabled={!otsFile || busy}
          className="px-4 py-2 rounded-xl font-semibold bg-amber-400 hover:bg-amber-300 text-black disabled:opacity-60 disabled:cursor-not-allowed"
        >
          تحقق
        </button>

        <span className="text-sky-200 text-sm truncate max-w-[50%]">
          {otsFile ? otsFile.name : "لم يتم اختيار أي ملف"}
        </span>
      </div>

      {/* ملاحظة */}
      <div className="text-sky-200 text-sm leading-relaxed">
        <strong>ملاحظة:</strong> للحصول على دليل كامل، احتفظ معًا بـ
        <span className="whitespace-nowrap"> (1) الملف الأصلي،</span>
        <span className="whitespace-nowrap"> (2) بصمته SHA-256</span>
        <span className="whitespace-nowrap"> و(3) ملف <code>.ots</code>.</span>
        تربط البصمة الملف بشكل فريد بالختم المسجّل على بيتكوين.
      </div>

      <div className="min-h-6">
        {busy && <p className="text-sky-200 text-sm">جاري التحقق…</p>}

        {!busy && blockHeight !== null && (
          <div className="text-sky-100">
            <p className="text-sm">النتيجة:</p>
            <p className="text-lg font-mono">
              ارتفاع الكتلة: <span className="font-bold">{blockHeight}</span>
            </p>
            <p className="text-sky-200 text-sm mt-2">
              احتفظ بهذا الرقم مع ملف <code>.ots</code> والوثيقة الأصلية:
              معًا يُشكّلان دليلك التقني.
            </p>
          </div>
        )}

        {!busy && msg && (
          <p
            className={
              msgType === "ok"
                ? "text-emerald-300 text-sm"
                : msgType === "warn"
                ? "text-amber-300 text-sm"
                : "text-rose-300 text-sm"
            }
          >
            {msg}
          </p>
        )}
      </div>
    </section>
  );
}
