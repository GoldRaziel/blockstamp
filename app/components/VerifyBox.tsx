"use client";

import React, { useEffect, useMemo, useState } from "react";

type ApiResp = {
  ok: boolean;
  status: "confirmed" | "pending" | "ok" | "error";
  block_height: number | null;
  all_block_heights?: number[];
  upgraded_attempted: boolean;
  stderr?: string;
  target_sha256?: string;
  error?: string;
};

type Dict = {
  title: string;
  uploadOts: string;
  uploadZip: string;
  chooseFile: string;
  noFile: string;
  verifyNow: string;
  result: string;
  firstAnchor: string;
  alsoAnchored: string;
  sha256: string;
  pendingTxt: string;
  okTxt: string;
  errorTxt: string;
  needOts: string;
};

const DICTS: Record<"it" | "en" | "ar", Dict> = {
  en: {
    title: "VERIFY YOUR TIMESTAMP",
    uploadOts: "Upload your .ots file",
    uploadZip: "Upload your .zip file",
    chooseFile: "Choose file",
    noFile: "No file selected",
    verifyNow: "Verify now",
    result: "Result",
    firstAnchor: "Bitcoin block (first anchor)",
    alsoAnchored: "Also anchored at",
    sha256: "File SHA-256",
    pendingTxt: "PENDING — the proof is upgrading",
    okTxt: "OK",
    errorTxt: "ERROR",
    needOts: "Please upload your .ots proof file.",
  },
  it: {
    title: "VERIFICA IL TUO TIMESTAMP",
    uploadOts: "Carica il tuo file .ots",
    uploadZip: "Carica il tuo file .zip",
    chooseFile: "Scegli file",
    noFile: "Nessun file selezionato",
    verifyNow: "Verifica ora",
    result: "Esito",
    firstAnchor: "Blocco Bitcoin (primo ancoraggio)",
    alsoAnchored: "Ancorato anche a",
    sha256: "SHA-256 del file",
    pendingTxt: "PENDING — la prova è in aggiornamento",
    okTxt: "OK",
    errorTxt: "ERRORE",
    needOts: "Carica il file di prova .ots.",
  },
  ar: {
    title: "تحقّق من الطابع الزمني",
    uploadOts: "ارفع ملف ‎.ots الخاص بك",
    uploadZip: "ارفع ملف ‎.zip الخاص بك",
    chooseFile: "اختر ملفًا",
    noFile: "لم يتم اختيار أي ملف",
    verifyNow: "تحقّق الآن",
    result: "النتيجة",
    firstAnchor: "كتلة البيتكوين (أقدم تثبيت)",
    alsoAnchored: "مثبّت أيضًا عند",
    sha256: "تجزئة SHA-256 للملف",
    pendingTxt: "قيد التحديث",
    okTxt: "حسنًا",
    errorTxt: "خطأ",
    needOts: "يرجى رفع ملف إثبات ‎.ots.",
  },
};

// lingua dal path (post-hydration) per evitare mismatch SSR/CSR
function detectLangFromPath(): "it" | "en" | "ar" {
  if (typeof window === "undefined") return "en";
  const p = window.location.pathname.toLowerCase();
  if (p.startsWith("/it")) return "it";
  if (p.startsWith("/ar")) return "ar";
  if (p.startsWith("/en")) return "en";
  return "en";
}

export default function VerifyBox() {
  const [loc, setLoc] = useState<"en" | "it" | "ar">("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLoc(detectLangFromPath());
    setReady(true);
  }, []);

  const dict = useMemo(() => DICTS[loc], [loc]);
  const dir = loc === "ar" ? "rtl" : "ltr";

  const [otsFile, setOtsFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<ApiResp | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const others =
    resp?.all_block_heights && resp.block_height != null
      ? resp.all_block_heights.filter((h) => h !== resp.block_height)
      : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setResp(null);
    try {
      if (!otsFile) {
        setErr(dict.needOts);
        return;
      }
      const form = new FormData();
      form.append("ots", otsFile, otsFile.name);
      if (zipFile) form.append("zip", zipFile, zipFile.name);

      const r = await fetch("/api/verify-ots", { method: "POST", body: form });
      const j = (await r.json()) as ApiResp;
      setResp(j);
      if (!r.ok && !j.ok && j.error) setErr(j.error);
    } catch (e: any) {
      setErr(e?.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      dir={dir}
      className="rounded-2xl bg-[#0e2431]/70 border border-sky-400/50 shadow-md p-6 md:p-8"
    >
      <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-6 text-amber-400">
        {dict.title}
      </h3>

      {!ready ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 rounded-xl bg-white/10" />
          <div className="h-10 rounded-xl bg-white/10" />
          <div className="h-10 w-32 rounded-xl bg-amber-400/60" />
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* OTS picker — stile quasi nativo, testi traducibili */}
            <div>
              <label className="block text-sm mb-2 font-medium">{dict.uploadOts} *</label>
              <FilePickerRow
                accept=".ots"
                onChange={(f) => setOtsFile(f)}
                buttonLabel={dict.chooseFile}
                noFileText={dict.noFile}
                dir={dir}
              />
            </div>

            {/* ZIP picker */}
            <div>
              <label className="block text-sm mb-2 font-medium">{dict.uploadZip}</label>
              <FilePickerRow
                accept="*/*"
                onChange={(f) => setZipFile(f)}
                buttonLabel={dict.chooseFile}
                noFileText={dict.noFile}
                dir={dir}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading || !otsFile}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold disabled:opacity-50"
              >
                {loading ? "..." : dict.verifyNow}
              </button>
            </div>
          </form>

          {/* Output */}
          <div className="mt-6 space-y-2 text-sm">
            {err && <p className="text-red-400">{err}</p>}
            {resp && (
              <>
                <Row label={dict.result} value={prettyStatus(resp, dict)} />
                {"block_height" in resp && (
                  <Row label={dict.firstAnchor} value={resp.block_height ?? "—"} />
                )}
                {others && others.length > 0 && (
                  <Row label={dict.alsoAnchored} value={<span>{others.join(", ")}</span>} />
                )}
                {resp?.target_sha256 && <Row mono label={dict.sha256} value={resp.target_sha256} />}
                {resp?.status === "error" && resp?.stderr && resp.stderr.trim() && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-white/70">Error details</summary>
                    <pre className="mt-2 whitespace-pre-wrap text-white/70 text-xs">
                      {resp.stderr}
                    </pre>
                  </details>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/** ---------- File picker “quasi nativo” ma traducibile ---------- */
function FilePickerRow({
  accept,
  onChange,
  buttonLabel,
  noFileText,
  dir,
}: {
  accept: string;
  onChange: (f: File | null) => void;
  buttonLabel: string;
  noFileText: string;
  dir: "ltr" | "rtl";
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const id = React.useId();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFileName(f ? f.name : null);
    onChange(f);
  }

  return (
    <div className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
      {/* Pulsante bianco come richiesto */}
      <label
        htmlFor={id}
        className="cursor-pointer inline-flex items-center justify-center px-3 py-2 rounded-lg bg-white hover:bg-white/90 text-black font-medium"
      >
        {buttonLabel}
      </label>

      {/* Campo testo file selezionato */}
      <div className="flex-1 rounded-lg border border-white/15 bg-black/20 min-h-[40px] px-3 py-2 text-sm text-white/80 overflow-hidden">
        <span className="break-all">{fileName ?? noFileText}</span>
      </div>

      {/* input file nascosto */}
      <input id={id} type="file" accept={accept} className="sr-only" onChange={handleChange} />
    </div>
  );
}

/** ---------- UI helpers ---------- */
function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-48 shrink-0 text-white/70">{label}</div>
      <div className={mono ? "font-mono break-all" : ""}>{value}</div>
    </div>
  );
}

function prettyStatus(r: ApiResp, dict: Dict) {
  if (!r) return "—";
  const s = r.status;
  if (s === "confirmed" && r.block_height != null) {
    return `CONFIRMED — Bitcoin block #${r.block_height}`;
  }
  if (s === "pending") return dict.pendingTxt;
  if (s === "ok") return dict.okTxt;
  if (s === "error") return dict.errorTxt;
  return s.toUpperCase();
}
