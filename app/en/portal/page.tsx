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

  // Language dropdown (right side) — keeps session_id in links
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
      <div className="relative text-sm">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-sky-100"
        >
          <span>🌐 Language</span>
          <span className="opacity-80">▼</span>
        </button>

        {open && (
          <div className="absolute right-0 z-10 mt-2 w-44 rounded-md bg-black/70 border border-white/10 shadow-lg backdrop-blur">
            <a href={hrefFor("it")} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10">
              <span>🇮🇹</span><span>Italiano</span>
            </a>
            <a href={hrefFor("en")} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10">
              <span>🇬🇧</span><span>English</span>
            </a>
            <a href={hrefFor("ar")} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10">
              <span>🇦🇪</span><span>العربية</span>
            </a>
          </div>
        )}
      </div>
    );
  }

  // Stabilizer: if we arrive with ?session_id, confirm & remove only the query (keep current locale/path)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const sid = sp.get("session_id");
    if (sid) {
      fetch(`/api/confirm?session_id=${encodeURIComponent(sid)}`, { cache: "no-store", credentials: "include" })
        .finally(() => {
          // keep /en/portal (or current locale path), just drop the query string
          history.replaceState({}, "", window.location.pathname);
        });
    }
  }, []);

  async function handleStamp() {
    setError("");
    setReceiptCode("");

    if (!zipFile) { setError("Please select the .zip file first."); return; }
    if (!zipFile.name.toLowerCase().endsWith(".zip")) { setError("Only .zip files are allowed."); return; }

    try {
      setBusy(true);
      const fd = new FormData();
      fd.append("zip", zipFile);

      
      const url = `/api/stamp${sid ? `?session_id=${encodeURIComponent(sid)}` : ""}`;
      const res = await fetch(url, {  method: "POST", credentials: "include", body: fd });
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const code = res.headers.get("x-receipt-code") || "";
      setReceiptCode(code);
      setLocked(true);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "blockstamp_receipt.ots";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Unexpected error.");
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
    <div className="max-w-3xl mx-auto pt-6 pb-24">
      {/* Header strip: logo (left) + language dropdown (right) */}
      <div className="mb-6 flex items-center justify-between">
        {/* Top-left logo, NOT clickable */}
        <img
          src="/logo.png"
          width="1000"
          height="500"
          alt="Blockstamp"
          className="h-auto max-h-14 md:max-h-20 w-auto origin-left md:scale-100 scale-[1.15] select-none pointer-events-none"
        />
        <LanguageDropdown />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-sky-100 mb-6">
        Protected area: Upload .zip and STAMP
      </h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <p className="text-sky-100"><strong>INSTRUCTIONS:</strong> Create a <strong>.zip</strong> containing:</p>
        <ul className="list-disc list-inside text-sky-100">
          <li>Your <strong>original file</strong> (or folder) to protect</li>
          <li>
            The <strong>text file (.txt)</strong> with the{" "}
            <span className="text-sky-300">SHA-256 code</span> you generated on our site
          </li>
          <li>Upload the created <strong>.zip</strong> below</li>
          <li>You will receive an <strong>.ots code</strong>: it’s the proof that registration was requested/completed</li>
          <li>Keep the <strong>.ots code</strong> together with your <strong>.zip file</strong></li>
          <li>In <strong>48–72 hours</strong> enter your <strong>.ots code</strong> on our Home, <strong>VERIFY</strong> section</li>
          <li>You will receive your <strong>block height</strong> on the Bitcoin blockchain</li>
          <li>Keep it safe: it is your indisputable proof of intellectual property on that date.</li>
        </ul>

        <div className="flex items-start gap-3">
          {/* Hidden input */}
          <input
            ref={inputRef}
            id="file-en"
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(e) => setZipFile(e.target.files?.[0] || null)}
          />

          {/* Button + selected filename underneath */}
          <div className="flex flex-col">
            <label
              htmlFor="file-en"
              className="px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-300 text-black font-semibold cursor-pointer"
            >
              Choose File
            </label>

            {/* Show selected filename */}
            {zipFile && (
              <div className="mt-2 text-sky-200 text-sm">
                {zipFile.name}
              </div>
            )}
          </div>

          {/* STAMP button */}
          <button
            onClick={handleStamp}
            disabled={busy || locked}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold disabled:opacity-50"
          >
            {busy ? "Processing..." : "STAMP on Blockchain"}
          </button>
        </div>

        {error && <div className="mt-2 text-red-300 text-sm">{error}</div>}
      </div>

      <div className="mt-8 bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-3">
        <h2 className="font-semibold text-sky-200">Your stamp will be generated here:</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-sky-300 break-all text-sm bg-black/20 rounded-md px-3 py-2 min-h-[2.5rem]">
              {receiptCode ? receiptCode : "\u2014 waiting for generation \u2014"}
            </div>
          </div>
          <button
            onClick={handleCopy}
            disabled={!receiptCode}
            className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold disabled:opacity-50"
          >
            COPY
          </button>
        </div>
        {copied && <div className="text-xs text-sky-400">Copied to clipboard \u2705</div>}
      </div>

      {/* Hide inherited navbar/header */}
      <style jsx global>{`
        header, nav { display: none !important; }
      `}</style>
    </div>
  );
}
