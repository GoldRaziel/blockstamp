"use client";
import { PRICE_BOX } from "../lib/content";

export default function PriceBox() {
  return (
    <section id="price" className="mt-10">
      <div className="max-w-3xl mx-auto bg-sky-900/20 border border-sky-300/50 rounded-xl p-4 text-sky-100 space-y-4">
        <h2 className="text-xl font-semibold">{PRICE_BOX.title}</h2>
        <ul className="list-disc pl-6 space-y-1">
          {PRICE_BOX.points?.map((p: string, i: number) => <li key={i}>{p}</li>)}
        </ul>
        <div>
          <a href="#pay" className="inline-block px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold">
            {PRICE_BOX.button}
          </a>
        </div>
      </div>
    </section>
  );
}
