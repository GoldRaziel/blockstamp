"use client";

import { useState } from "react";

export default function VerifyBox() {
  const [otsFile, setOtsFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [msgType, setMsgType] = useState<"ok" | "warn" | "error" | "">("");
  const [blockHeight, setBlockHeight] = useState<number | null>(null);

  function pickFile() {
    document.getElementById("otsPicker-en")?.click();
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
          setMsg("Non-existent code");
          setMsgType("warn");
          return;
        }

        setMsg("Please wait 48–72 hours before verifying");
        setMsgType("warn");
        return;
      }

      const h = Number(
        data?.block_height ?? data?.blockHeight ?? data?.result?.block_height
      );
      if (Number.isFinite(h)) {
        setBlockHeight(h);
        setMsg("Verification completed.");
        setMsgType("ok");
      } else {
        setMsg("Non-existent code");
        setMsgType("warn");
      }
    } catch {
      setMsg("Please wait 48–72 hours before verifying");
      setMsgType("warn");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      id="verify-en"
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
        <input
          id="otsPicker-en"
          type="file"
          accept=".ots"
          className="hidden"
          onChange={(e) => setOtsFile(e.target.files?.[0] ?? null)}
        />

        {/* UPLOAD FILE = white */}
        <button
          type="button"
          onClick={pickFile}
          disabled={busy}
          className="px-4 py-2 rounded-xl font-semibold bg-white hover:bg-neutral-200 text-black disabled:opacity-60 disabled:cursor-not-allowed"
        >
          UPLOAD FILE
        </button>

        {/* VERIFY = amber */}
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

      {/* NOTE */}
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
