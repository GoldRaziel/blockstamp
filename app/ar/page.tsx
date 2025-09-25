"use client";
import PayNow from "./components/PayNow";
import PayButton from "./components/PayButton";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import VerifyBox from "./components/VerifyBox";
import { useEffect, useState } from "react";
import PriceBox from "./components/PriceBox";

function toHex(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

async function startPayment() {
  try {
    const res = await fetch(`/api/create-checkout-session?ts=${Date.now()}`, { method: "POST", cache: "no-store" });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    if (!data?.url) throw new Error("URL checkout non ricevuto");
    window.location.href = data.url;
  } catch (e) {
    console.error(e);
    alert("Errore avvio checkout");
  }
}
export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [serverHash, setServerHash] = useState<string>("");
  const [paid, setPaid] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [showPayNotice, setShowPayNotice] = useState(false);

  // verifica stato pagamento
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/session", { cache: "no-store", credentials: "include" });
        const j = await r.json();
        setPaid(!!j.paid);
      } catch {
        /* ignore */
      } finally {
        setSessionReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (paid) setShowPayNotice(false);
  }, [paid]);

  async function handleFile(f?: File | null) {
    if (!f) return;
    setBusy(true);
    setError("");
    setServerHash("");
    try {
      const buf = await f.arrayBuffer();
      const digest = await crypto.subtle.digest("SHA-256", buf);
      setHash(toHex(digest));
      setFile(f);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Errore durante il calcolo dell'impronta.");
    } finally {
      setBusy(false);
    }
  }

  async function copyHash() {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = hash;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  }

  async function startPayment() {
    try {
    const seg0 = (typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "it");
     const locale = (seg0 === "en" || seg0 === "ar" || seg0 === "it") ? seg0 : "it";
      const res = await fetch(`/api/pay?locale=${locale}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, 
          amount: 500,
          currency: "eur",
          description: "Blockstamp Protection",
        }),
      });
      const json = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error(json.error || "Errore pagamento");
      if (json.url) window.location.href = json.url;
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Errore durante il pagamento.");
    }
  }

  async function submitToServer() {
    if (!hash || !file) return;
    setBusy(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/submit", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "X-Paid": paid ? "1" : "0" },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Errore durante l'invio.");
      setServerHash(json.hash);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Errore durante l'invio al server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-16">
      <div className="beam beam-hero"></div>

      {/* HERO */}
      <section className="hero text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
          <span className="text-white">احمِ </span>
          <span className="text-sky-400">فكرتك</span>
          <br />
          <span className="text-white">على </span>
          <span className="text-sky-400">البلوكتشين</span>
          <span className="text-sky-400 text-2xl align-middle"> • </span>
          <span className="text-white">بيتكوين</span>
        </h1>
        <p className="text-lg opacity-90 max-w-3xl mx-auto">
          الطريقة الأكثر أمانًا وسرعةً في العالم لتسجيل وحماية حقوقك الفكرية.
        </p>
      </section>

      {/* UPLOAD (ridotto: solo PriceBox) */}
      


<section id="upload" className="my-10">
  <div className="grid md:grid-cols-2 gap-6 items-start">
    {/* Colonna sinistra: pagamento */}
    <div className="space-y-3">
      <PriceBox />
    </div>

    {/* Colonna destra: Perché Blockchain + CTA */}
    
<div dir="rtl" lang="ar" className="space-y-6">
  

<h3 className="mt-6 text-xl font-semibold">لماذا البلوكتشين</h3>


  <ul className="list-disc pr-6 space-y-2 text-sm opacity-90">
    <li><b>الثبات:</b> بمجرد تسجيلها، لا يمكن تعديل الإثبات.</li>
    <li><b>دليل عام:</b> مرجع يمكن لأيّ شخص التحقق منه في أي مكان.</li>
    <li><b>الخصوصية:</b> نسجّل البصمة فقط؛ يبقى الملف لديك.</li>
    <li><b>دون وساطة:</b> إثبات مستقل بلا ثقة عمياء بأطراف ثالثة.</li>
    <li><b>صلاحية عالمية:</b> تسجيل واحد معترف به في كل مكان.</li>
  </ul>

  <PayNow />
</div>

  </div>

  {/* Riquadro istruzioni */}
  <div dir="rtl" lang="ar" className="mt-10 bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-4">
    <h3 className="text-lg font-semibold flex items-center gap-2">اتبع التعليمات</h3>
    <ol className="list-decimal pl-6 space-y-1 text-sm opacity-90">
      <li>اختر الملف الذي تريد حمايته.</li>
      <li>ستحصل على بصمة SHA-256 فريدة.</li>
      <li><b>انسخ</b> البصمة والصقها في ملف نصي <code>.txt</code>.</li>
      <li>اضغط الملف الأصلي <i>مع</i> ملف <code>.txt</code> في أرشيف <code>.zip</code>.</li>
      <li>ارجع إلى هنا واضغط <b>ادفع الآن</b>.</li>
      <li>بعد الدفع، ارفع ملف <code>.zip</code> في الصفحة التالية.</li>
    </ol>

    <div className="space-y-3">
      <div>
        <label className="block text-sm opacity-80 mb-1">File</label>
       {/* INPUT FILE nascosto */}
<input
  id="file-upload"
  type="file"
  onChange={(e) => handleFile(e.target.files?.[0] || null)}
  className="hidden"
/>

{/* SOLO IL TASTO è cliccabile per aprire il file */}
<label
  htmlFor="file-upload"
  className="inline-flex items-center justify-center gap-2 px-4 py-2
             bg-neutral-900 hover:bg-neutral-800 text-white
             border border-white/10 rounded-none
             cursor-pointer select-none"
>
  اختر ملفًا
</label>

        {file && (
          <div className="text-xs opacity-70 mt-1">{file.name}</div>
        )}
      </div>

      <div>
        <label className="block text-sm opacity-80 mb-1">بصمة SHA-256</label>
        <div className="flex gap-2">
          <textarea
            className="flex-1 h-16 rounded-lg bg-black/40 border border-white/10 p-2 text-xs font-mono"
            readOnly
            value={hash}
            placeholder="ستظهر البصمة هنا…"
          />
          <button
            onClick={copyHash}
            disabled={!hash}
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40"
          >
            نسخ
          </button>
        </div>
      </div>
    </div>

    <p className="text-xs opacity-70 mt-2">
      نصيحة: أعد تسمية الملف النصي إلى شيء مثل <code>hash.txt</code> واحتفظ به داخل <code>.zip</code> بجانب الملف الأصلي.
    </p>
  </div>

</section>




      {/* PROCEDURA */}
      <section id="procedure" dir="rtl" lang="ar" className="space-y-5">
        <h2 className="text-3xl font-semibold">الإجراء</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-sm opacity-70 mb-2">١ · ارفع ملفك</div>
            <p className="text-sm opacity-90">
              اختر المستند أو الفكرة أو المشروع الذي تريد حمايته. لن يُنشر أي محتوى: يبقى ملكًا لك فقط.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-sm opacity-70 mb-2">٢ · التسجيل على البلوكتشين</div>
            <p className="text-sm opacity-90">
              ننشئ أثرًا لا يُمحى يُثبت وجود فكرتك في تاريخ محدد. يتم تثبيت هذا الإثبات على بلوكتشين بيتكوين، الأكثر أمانًا في العالم.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="text-sm opacity-70 mb-2">٣ · الإثبات والتحقق</div>
            <p className="text-sm opacity-90">
              ستتلقى إيصالًا رقميًا يمكنك عرضه في أي وقت لإثبات حقوقك. لاحقًا يكفيك مقارنته بملفك لإثبات الأصالة.
            </p>
          </div>
        </div>
      </section>

      <VerifyBox />


     {/* الدليل */}
<section id="guide" className="space-y-6" dir="rtl">
  <h2 className="text-3xl font-semibold">دليل: احمِ فكرتك بأفضل طريقة</h2>
  <div className="grid md:grid-cols-3 gap-6">
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-2">1 · أنشئ ملف ZIP</h3>
      <p className="text-sm opacity-90">
        ضع <b>أكبر قدر ممكن من المواد</b>: مستندات، نصوص، صور، مسودات، مشاريع،
        هيكل الموقع، عقود — كل ما يثبت <b>ملكية</b> الفكرة.
      </p>
    </div>
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-2">2 · ارفع الملف من الصفحة الرئيسية</h3>
      <p className="text-sm opacity-90">
        انتقل إلى قسم <a href="#upload" className="underline">الرفع</a> وقم برفع ملف الـ ZIP.
        ستتلقى <b>رمز ‎.ots</b> لتأكيد الطلب: احفظه <b>داخل مجلد الـ ZIP نفسه</b>.
      </p>
    </div>
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-2">3 · التسجيل خلال 72 ساعة</h3>
      <p className="text-sm opacity-90">
        خلال <b>72 ساعة</b> ستتلقى رمز التسجيل على بلوكتشين بيتكوين الذي يُثبت
        وجود ملفك على مستوى العالم، مما يجعل فكرتك <b>محميّة وغير قابلة للتعديل</b>.
      </p>
    </div>
  </div>
  <div className="bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-4">
    <p className="text-sm opacity-90 max-w-3xl mx-auto">
      النتيجة: <b>دليل تقني وقانوني</b> منقوش على بلوكتشين بيتكوين — <b>غير قابل للتغيير</b>
      وصالح في جميع أنحاء العالم.
    </p>
  </div>
</section>


      {/* PERCHÉ BLOCKCHAIN */}
      
      {/* FAQ */}
      <section id="faq" className="space-y-4" dir="rtl" lang="ar">
  <h2 className="text-3xl font-semibold">الأسئلة الشائعة</h2>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">ما هي البلوكتشين؟</summary>
    <div className="mt-2 text-sm opacity-90 space-y-2">
      <p>
        <b>البلوكتشين</b> سجل موزّع وغير قابل للتلاعب: سلسلة من الكُتل، كل كتلة تحتوي بيانات
        (مثل المعاملات) وهاش الكتلة السابقة. هذا الربط يجعل السلسلة مقاومة للتزوير.
      </p>
      <p className="font-medium">كيف تعمل باختصار:</p>
      <ol className="list-decimal pr-5 space-y-1">
        <li>تُجمّع العمليات في كتلة جديدة.</li>
        <li>يُحسب بصمة (هاش) فريدة للكتلة.</li>
        <li>تتضمن الكتلة هاش الكتلة السابقة، فتتشكل السلسلة.</li>
        <li>توافق الشبكة على الكتلة عبر <i>آليات إجماع</i> (مثل إثبات العمل/إثبات الحصّة).</li>
        <li>بعد الإضافة، تغييرها يتطلب إعادة كتابة كل الكُتل اللاحقة.</li>
      </ol>
      <ul className="list-disc pr-5 space-y-1">
        <li><b>اللامركزية:</b> لا سلطة مركزية؛ عقد عديدة تتشارك السجل نفسه.</li>
        <li><b>الشفافية:</b> في الشبكات العامة، السجل متاح للتحقق من الجميع.</li>
        <li><b>الأمان:</b> التشفير + الإجماع يصعّبان التزوير للغاية.</li>
      </ul>
      <p>
        عمليًا هو كـ<i>دفتر أستاذ عام</i> ترتبط فيه كل صفحة (كتلة) بالسابقة وتُوافق عليها الشبكة —
        طريقة موثوقة لتسجيل المعلومات دون وسيط.
      </p>
    </div>
  </details>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">هل يتم رفع ملفي أو تخزينه؟</summary>
    <p className="mt-2 text-sm opacity-90">
      لا. تُحسب البصمة محليًا داخل المتصفح. نقوم فقط بتثبيت البصمة (غير قابلة للعكس).
    </p>
  </details>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">ماذا تُثبت الحُجّة على البلوكتشين؟</summary>
    <p className="mt-2 text-sm opacity-90">
      تُثبت أن محتوىً ذو <b>تلك البصمة المحدّدة</b> قد تم تسجيله على بيتكوين على الأقل بتاريخ الإشارة. لا تكشف المحتوى ولا تثبت هويتك.
    </p>
  </details>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">كيف أتحقق لاحقًا؟</summary>
    <p className="mt-2 text-sm opacity-90">
      أعد حساب بصمة الملف الأصلي وقارنها مع البصمة الموجودة في الإثبات. إذا تطابقت، فلدَيك سلامة ومرجع عام على بيتكوين.
    </p>
  </details>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">ماذا لو فقدت الملف؟</summary>
    <p className="mt-2 text-sm opacity-90">
      لا يمكن للبصمة استعادة المحتوى. احتفظ بنُسخ احتياطية آمنة للملف الأصلي؛ الإثبات يبرهن الوجود والسلامة في وقت محدد ولا يسترجع المحتوى.
    </p>
  </details>
</section>


      <div className="beam beam-footer"></div>
    </div>
  );
}
