"use client";
import { useState } from "react";

type Locale = "it" | "en" | "ar";

export default function VerifyBoxLocalized({ locale }: { locale: Locale }) {
  const [otsFile, setOtsFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [msgType, setMsgType] = useState<"ok" | "warn" | "error" | "">("");
  const [blockHeight, setBlockHeight] = useState<number | null>(null);

  function pickFile() {
    document.getElementById("otsPicker")?.click();
  }

  async function handleVerify() {
    if (!otsFile || busy) return;
    setBusy(true);
    setMsg(""); setMsgType(""); setBlockHeight(null);
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
          setMsg(locale === "en" ? "Non-existent code" : locale === "ar" ? "رمز غير موجود" : "codice inesistente");
          setMsgType("warn");
          return;
        }
        setMsg(locale === "en" ? "Please wait 48–72 hours before verifying"
          : locale === "ar" ? "يُرجى الانتظار 48–72 ساعة قبل التحقق"
          : "attendi 48-72 ore prima di verificare");
        setMsgType("warn");
        return;
      }

      const h = Number(data?.block_height ?? data?.blockHeight ?? data?.result?.block_height);
      if (Number.isFinite(h)) {
        setBlockHeight(h);
        setMsg(locale === "en" ? "Verification completed."
          : locale === "ar" ? "تم اكتمال التحقق."
          : "Verifica completata.");
        setMsgType("ok");
      } else {
        setMsg(locale === "en" ? "Non-existent code" : locale === "ar" ? "رمز غير موجود" : "codice inesistente");
        setMsgType("warn");
      }
    } catch {
      setMsg(locale === "en" ? "Please wait 48–72 hours before verifying"
        : locale === "ar" ? "يُرجى الانتظار 48–72 ساعة قبل التحقق"
        : "attendi 48-72 ore prima di verificare");
      setMsgType("warn");
    } finally { setBusy(false); }
  }

  const dir = locale === "ar" ? "rtl" : undefined;
  const H = locale === "en" ? "VERIFY" : locale === "ar" ? "تحقق" : "VERIFICA";

  const P1 = locale === "en"
    ? <>Upload your <code>.ots</code> file below and click <strong>VERIFY</strong>.{" "}
         You will get your <strong>block number</strong> registered on the Bitcoin blockchain.</>
    : locale === "ar"
    ? <>قم بتحميل ملفك <code>.ots</code> أدناه ثم اضغط <strong>تحقق</strong>.{" "}
         ستحصل على <strong>رقم الكتلة</strong> المسجّل في سلسلة كتل البيتكوين.</>
    : <>Inserisci qui sotto il tuo file <code>.ots</code> e clicca <strong>VERIFICA</strong>.{" "}
         Otterrai il tuo <strong>numero di blocco</strong> registrato nella blockchain Bitcoin.</>;

  const P2 = locale === "en"
    ? <><strong>What it means:</strong> the timestamp stores the fingerprint (SHA-256) of your file
         in Bitcoin through an addition path (Merkle). The <em>Block Height</em> indicates the block
         that anchors your proof. This provides a <strong>proof of existence and temporal priority</strong>:
         it shows that your content existed at least at the date/time of that block.{" "}
         <strong>Keep it: it is your technical evidence that protects you legally.</strong></>
    : locale === "ar"
    ? <><strong>ماذا يعني ذلك:</strong> الختم الزمني يحفظ البصمة الرقمية (SHA-256) لملفك
         على بيتكوين عبر مسار الإضافة (Merkle). يشير <em>ارتفاع الكتلة</em> إلى الكتلة
         التي تُثبّت دليلك. هذا يوفّر <strong>دليل وجود وأولوية زمنية</strong>:
         يثبت أن محتواك كان موجودًا على الأقل في تاريخ/وقت تلك الكتلة.{" "}
         <strong>احتفظ به: فهو دليلك التقني الذي يحميك قانونيًا.</strong></>
    : <><strong>Cosa significa:</strong> la timbratura memorizza l&apos;impronta (SHA-256) del tuo file
         in Bitcoin tramite un percorso di aggiunzione (Merkle). Il <em>Block Height</em> indica il blocco
         che ancora (ancoraggio) la tua prova. Questo fornisce una <strong>prova di esistenza e priorità temporale</strong>:
         dimostra che il tuo contenuto esisteva almeno alla data/ora di quel blocco.{" "}
         <strong>Conservalo: è la tua evidenza tecnica che ti tutela dal punto di vista legale.</strong></>;

  const BTN_UPLOAD = locale === "en" ? "UPLOAD FILE" : locale === "ar" ? "تحميل الملف" : "CARICA FILE";
  const BTN_VERIFY = locale === "en" ? "VERIFY"      : locale === "ar" ? "تحقق"       : "VERIFICA";
  const NO_FILE    = locale === "en" ? "No file selected" : locale === "ar" ? "لم يتم اختيار أي ملف" : "Nessun file selezionato";

  const NOTE = locale === "en"
    ? <> <strong>Note:</strong> for complete proof keep together
         <span className="whitespace-nowrap"> (1) the original file,</span>
         <span className="whitespace-nowrap"> (2) its SHA-256 hash</span> and
         <span className="whitespace-nowrap"> (3) the <code>.ots</code> file.</span>
         The hash uniquely links the file to the timestamp recorded on Bitcoin.</>
    : locale === "ar"
    ? <> <strong>ملاحظة:</strong> للحصول على دليل كامل، احتفظ معًا بـ
         <span className="whitespace-nowrap"> (1) الملف الأصلي،</span>
         <span className="whitespace-nowrap"> (2) بصمته SHA-256</span>
         <span className="whitespace-nowrap"> و(3) ملف <code>.ots</code>.</span>
         تربط البصمة الملف بشكل فريد بالختم المسجّل على بيتكوين.</>
    : <> <strong>Nota:</strong> per una prova completa conserva insieme
         <span className="whitespace-nowrap"> (1) il file originale,</span>
         <span className="whitespace-nowrap"> (2) il suo hash SHA-256</span> e
         <span className="whitespace-nowrap"> (3) il file <code>.ots</code>.</span>
         L’hash collega in modo univoco il file alla timbratura registrata su Bitcoin.</>;

  const RESULT_LABEL = locale === "en" ? "Result:" : locale === "ar" ? "النتيجة:" : "Risultato:";
  const VERIFYING    = locale === "en" ? "Verification in progress…" : locale === "ar" ? "جاري التحقق…" : "Verifica in corso…";
  const KEEP_NUMBER  = locale === "en"
    ? <>Keep this number together with your <code>.ots</code> file and the original document:
        together they constitute your technical evidence.</>
    : locale === "ar"
    ? <>احتفظ بهذا الرقم مع ملف <code>.ots</code> والوثيقة الأصلية:
        معًا يُشكّلان دليلك التقني.</>
    : <>Conserva questo numero insieme al tuo file <code>.ots</code> e al documento originale:
        insieme costituiscono la tua evidenza tecnica.</>;

  return (
    <section
      id={`verifica-${locale}`}
      dir={dir}
      className="mt-10 bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-4"
    >
      {/* input file condiviso per il componente */}
      <input
        id="otsPicker"
        type="file"
        accept=".ots"
        className="hidden"
        onChange={(e) => setOtsFile(e.target.files?.[0] ?? null)}
      />

      <h2 className="text-xl font-semibold text-white">{H}</h2>

      <p className="text-sky-100 text-sm">{P1}</p>
      <p className="text-sky-100 text-sm">{P2}</p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={pickFile}
          disabled={busy}
          className="px-4 py-2 rounded-xl font-semibold bg-white hover:bg-neutral-200 text-black disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {BTN_UPLOAD}
        </button>

        <button
          type="button"
          onClick={handleVerify}
          disabled={!otsFile || busy}
          className="px-4 py-2 rounded-xl font-semibold bg-amber-400 hover:bg-amber-300 text-black disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {BTN_VERIFY}
        </button>

        <span className="text-sky-200 text-sm truncate max-w-[50%]">
          {otsFile ? otsFile.name : NO_FILE}
        </span>
      </div>

      <div className="text-sky-200 text-sm leading-relaxed">{NOTE}</div>

      <div className="min-h-6">
        {busy && <p className="text-sky-200 text-sm">{VERIFYING}</p>}

        {!busy && blockHeight !== null && (
          <div className="text-sky-100">
            <p className="text-sm">{RESULT_LABEL}</p>
            <p className="text-lg font-mono">
              Block Height: <span className="font-bold">{blockHeight}</span>
            </p>
            <p className="text-sky-200 text-sm mt-2">{KEEP_NUMBER}</p>
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
