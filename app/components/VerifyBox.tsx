"use client";

import { useState } from "react";

export default function VerifyBox() {
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
          setMsg("codice inesistente");
          setMsgType("warn");
          return;
        }

        setMsg("attendi 48-72 ore prima di verificare");
        setMsgType("warn");
        return;
      }

      const h = Number(
        data?.block_height ?? data?.blockHeight ?? data?.result?.block_height
      );
      if (Number.isFinite(h)) {
        setBlockHeight(h);
        setMsg("Verifica completata.");
        setMsgType("ok");
      } else {
        setMsg("codice inesistente");
        setMsgType("warn");
      }
    } catch {
      setMsg("attendi 48-72 ore prima di verificare");
      setMsgType("warn");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Input file UNICO condiviso tra i tre riquadri (evita ID duplicati) */}
      <input
        id="otsPicker"
        type="file"
        accept=".ots"
        className="hidden"
        onChange={(e) => setOtsFile(e.target.files?.[0] ?? null)}
      />

      {/* ========================== ITALIANO ========================== */}
      <section
        id="verifica-it"
        className="mt-10 bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-4"
      >
        <h2 className="text-xl font-semibold text-white">VERIFICA</h2>

        <p className="text-sky-100 text-sm">
          Inserisci qui sotto il tuo file <code>.ots</code> e clicca <strong>VERIFICA</strong>.{" "}
          Otterrai il tuo <strong>numero di blocco</strong> registrato nella blockchain Bitcoin.
        </p>

        <p className="text-sky-100 text-sm">
          <strong>Cosa significa:</strong> la timbratura memorizza l&apos;impronta (SHA-256) del tuo file
          in Bitcoin tramite un percorso di aggiunzione (Merkle). Il <em>Block Height</em> indica il blocco
          che ancora (ancoraggio) la tua prova. Questo fornisce una <strong>prova di esistenza e priorità temporale</strong>:
          dimostra che il tuo contenuto esisteva almeno alla data/ora di quel blocco.{" "}
          <strong>Conservalo: è la tua evidenza tecnica che ti tutela dal punto di vista legale.</strong>
        </p>

        <div className="flex items-center gap-3">
          {/* CARICA FILE = bianco */}
          <button
            type="button"
            onClick={pickFile}
            disabled={busy}
            className="px-4 py-2 rounded-xl font-semibold bg-white hover:bg-neutral-200 text-black disabled:opacity-60 disabled:cursor-not-allowed"
          >
            CARICA FILE
          </button>

          {/* VERIFICA = amber */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={!otsFile || busy}
            className="px-4 py-2 rounded-xl font-semibold bg-amber-400 hover:bg-amber-300 text-black disabled:opacity-60 disabled:cursor-not-allowed"
          >
            VERIFICA
          </button>

          <span className="text-sky-200 text-sm truncate max-w-[50%]">
            {otsFile ? otsFile.name : "Nessun file selezionato"}
          </span>
        </div>

        {/* NOTA con stessa dimensione */}
        <div className="text-sky-200 text-sm leading-relaxed">
          <strong>Nota:</strong> per una prova completa conserva insieme
          <span className="whitespace-nowrap"> (1) il file originale,</span>
          <span className="whitespace-nowrap"> (2) il suo hash SHA-256</span> e
          <span className="whitespace-nowrap"> (3) il file <code>.ots</code>.</span>
          L’hash collega in modo univoco il file alla timbratura registrata su Bitcoin.
        </div>

        <div className="min-h-6">
          {busy && <p className="text-sky-200 text-sm">Verifica in corso…</p>}

          {!busy && blockHeight !== null && (
            <div className="text-sky-100">
              <p className="text-sm">Risultato:</p>
              <p className="text-lg font-mono">
                Block Height: <span className="font-bold">{blockHeight}</span>
              </p>
              <p className="text-sky-200 text-sm mt-2">
                Conserva questo numero insieme al tuo file <code>.ots</code> e al documento originale:
                insieme costituiscono la tua evidenza tecnica.
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

      {/* ========================== ENGLISH ========================== */}
      <section
        id="verifica-en"
        className="mt-10 bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-4"
      >
        <h2 className="text-xl font-semibold text-white">VERIFY</h2>

        <p className="text-sky-100 text-sm">
          Upload your <code>.ots</code> file below and click <strong>VERIFY</strong>.{" "}
          You will get your <strong>block number</strong> registered on the Bitcoin blockchain.
        </p>

        <p className="text-sky-100 text-sm">
          <strong>What it means:</strong> the timestamp stores the fingerprint (SHA-256) of your file
          in Bitcoin through an addition path (Merkle). The <em>Block Height</em> indicates the block
          that anchors your proof. This provides a <strong>proof of existence and temporal priority</strong>:
          it shows that your content existed at least at the date/time of that block.{" "}
          <strong>Keep it: it is your technical evidence that protects you legally.</strong>
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={pickFile}
            disabled={busy}
            className="px-4 py-2 rounded-xl font-semibold bg-white hover:bg-neutral-200 text-black disabled:opacity-60 disabled:cursor-not-allowed"
          >
            UPLOAD FILE
          </button>

        <button
            type="button"
            onClick={handleVerify}
            disabled={!otsFile || busy}
            className="px-4 py-2 rounded-xl font-semibold bg-amber-400 hover:bg-amber-300 text-black disabled:opacity-60 disabled:cursor-not-allowed"
          >
            VERIFY
          </button>

          <span className="text-sky-200 text-sm truncate max-w-[50%]">
            {otsFile ? otsFile.name : "No file selected"}
          </span>
        </div>

        <div className="text-sky-200 text-sm leading-relaxed">
          <strong>Note:</strong> for complete proof keep together
          <span className="whitespace-nowrap"> (1) the original file,</span>
          <span className="whitespace-nowrap"> (2) its SHA-256 hash</span> and
          <span className="whitespace-nowrap"> (3) the <code>.ots</code> file.</span>
          The hash uniquely links the file to the timestamp recorded on Bitcoin.
        </div>

        <div className="min-h-6">
          {busy && <p className="text-sky-200 text-sm">Verification in progress…</p>}

          {!busy && blockHeight !== null && (
            <div className="text-sky-100">
              <p className="text-sm">Result:</p>
              <p className="text-lg font-mono">
                Block Height: <span className="font-bold">{blockHeight}</span>
              </p>
              <p className="text-sky-200 text-sm mt-2">
                Keep this number together with your <code>.ots</code> file and the original document:
                together they constitute your technical evidence.
              </p>
            </div>
          )}

          {!busy && msgType && (
            <p
              className={
                msgType === "ok"
                  ? "text-emerald-300 text-sm"
                  : msgType === "warn"
                  ? "text-amber-300 text-sm"
                  : "text-rose-300 text-sm"
              }
            >
              {msgType === "ok"
                ? "Verification completed."
                : msgType === "warn"
                ? (msg.includes("codice inesistente")
                    ? "Non-existent code"
                    : "Please wait 48–72 hours before verifying")
                : "Error"}
            </p>
          )}
        </div>
      </section>

      {/* ========================== ARABIC (RTL) ========================== */}
      <section
        id="verifica-ar"
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
          <button
            type="button"
            onClick={pickFile}
            disabled={busy}
            className="px-4 py-2 rounded-xl font-semibold bg-white hover:bg-neutral-200 text-black disabled:opacity-60 disabled:cursor-not-allowed"
          >
            تحميل الملف
          </button>

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

          {!busy && msgType && (
            <p
              className={
                msgType === "ok"
                  ? "text-emerald-300 text-sm"
                  : msgType === "warn"
                  ? "text-amber-300 text-sm"
                  : "text-rose-300 text-sm"
              }
            >
              {msgType === "ok"
                ? "تم اكتمال التحقق."
                : msgType === "warn"
                ? (msg.includes("codice inesistente")
                    ? "رمز غير موجود"
                    : "يُرجى الانتظار 48–72 ساعة قبل التحقق")
                : "خطأ"}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
