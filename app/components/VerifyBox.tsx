"use client";

import React, { useMemo, useState } from "react";

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
  uploadOts: string;
  uploadZip: string;
  verifyNow: string;
  result: string;
  firstAnchor: string;
  alsoAnchored: string;
  sha256: string;
  pendingTxt: string;
  okTxt: string;
  errorTxt: string;
};

const DICTS: Record<"it"|"en"|"ar", Dict> = {
  en: {
    uploadOts: "Upload your .ots file",
    uploadZip: "Upload your .zip file",
    verifyNow: "Verify now",
    result: "Result",
    firstAnchor: "Bitcoin block (first anchor)",
    alsoAnchored: "Also anchored at",
    sha256: "File SHA-256",
    pendingTxt: "PENDING — the proof is upgrading",
    okTxt: "OK",
    errorTxt: "ERROR",
  },
  it: {
    uploadOts: "Carica il tuo file .ots",
    uploadZip: "Carica il tuo file .zip",
    verifyNow: "Verifica ora",
    result: "Esito",
    firstAnchor: "Blocco Bitcoin (primo ancoraggio)",
    alsoAnchored: "Ancorato anche a",
    sha256: "SHA-256 del file",
    pendingTxt: "PENDING — la prova è in aggiornamento",
    okTxt: "OK",
    errorTxt: "ERRORE",
  },
  ar: {
    uploadOts: "ارفع ملف .ots الخاص بك",
    uploadZip: "ارفع ملف .zip الخاص بك",
    verifyNow: "تحقق الآن",
    result: "النتيجة",
    firstAnchor: "كتلة البيتكوين (أقدم تثبيت)",
    alsoAnchored: "مثبّت أيضًا عند",
    sha256: "تجزئة SHA-256 للملف",
    pendingTxt: "قيد التحديث",
    okTxt: "حسناً",
    errorTxt: "خطأ",
  },
};

function detectLocale(pathname: string): "it"|"en"|"ar" {
  if (pathname.startsWith("/ar")) return "ar";
  if (pathname.startsWith("/en")) return "en";
  return "it";
}

export default function VerifyBox() {
  const [otsFile, setOtsFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<ApiResp | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const { dict, dir } = useMemo(() => {
    const loc = typeof window !== "undefined" ? detectLocale(window.location.pathname) : "it";
    return { dict: DICTS[loc], dir: loc === "ar" ? "rtl" : "ltr" };
  }, []);

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
        setErr("Please upload your .ots proof file.");
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
      className="
        rounded-2xl
        bg-[#0e2431]/70 border border-sky-400/50
        shadow-md
        p-6 md:p-8
      "
    >
      {/* Titolo allineato ai box della HOME: peso bold, dimensione come 'SEGUI LE ISTRUZIONI', colore amber-400 */}
      <h3 className="text-2xl font-bold tracking-tight mb-6 text-amber-400">
        VERIFY YOUR TIMESTAMP
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 font-medium">{dict.uploadOts} *</label>
          <input
            type="file"
            accept=".ots"
            onChange={(e) => setOtsFile(e.target.files?.[0] ?? null)}
            className="block w-full rounded-xl border border-white/15 bg-black/20 p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium">{dict.uploadZip}</label>
          <input
            type="file"
            onChange={(e) => setZipFile(e.target.files?.[0] ?? null)}
            className="block w-full rounded-xl border border-white/15 bg-black/20 p-2"
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

            {/* Mostra dettagli errore solo in caso di errore */}
            {resp?.status === "error" && resp?.stderr && resp.stderr.trim() && (
              <details className="mt-2">
                <summary className="cursor-pointer text-white/70">Error details</summary>
                <pre className="mt-2 whitespace-pre-wrap text-white/70 text-xs">{resp.stderr}</pre>
              </details>
            )}
          </>
        )}
      </div>
    </div>
  );
}

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
