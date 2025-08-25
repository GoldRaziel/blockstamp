"use client";
import { PAY_TEXTS } from "../lib/content";

export default function PayNow() {
  return (
    <section id="pay" className="mt-10">
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">{PAY_TEXTS.payNow}</h2>
        <p className="text-sm opacity-80">{PAY_TEXTS.payToUnlock}</p>
        <a href="/pay" className="inline-block px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold">
          {PAY_TEXTS.payNow}
        </a>
      </div>
    </section>
  );
}
