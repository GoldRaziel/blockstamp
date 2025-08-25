"use client";
import { VERIFY_BOX } from "../lib/content";
import { useState } from "react";

export default function VerifyBox() {
  const [result, setResult] = useState<string>("");

  return (
    <section id="verify" className="mt-10">
      <div className="max-w-3xl mx-auto mt-4 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">{VERIFY_BOX.title}</h2>
        <p className="text-sm opacity-90">{VERIFY_BOX.intro}</p>
        <p className="text-xs opacity-70">{VERIFY_BOX.helper}</p>

        <div className="flex items-center gap-3">
          <input type="file" className="text-sm" />
          <button className="px-3 py-2 rounded-lg border border-white/20 hover:border-white/40"
                  onClick={() => setResult("...")}>
            {VERIFY_BOX.action}
          </button>
        </div>

        {result && (
          <div className="text-sm">
            <span className="opacity-70 mr-2">{VERIFY_BOX.resultLabel}:</span>
            <span className="font-mono">—</span>
          </div>
        )}
      </div>
    </section>
  );
}
