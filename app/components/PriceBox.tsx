"use client";
import React from "react";

export default function PriceBox() {
  return (
    <div className="mt-3 rounded-lg border border-sky-300/50 bg-sky-900/20 p-3 text-sky-100">
      <div className="text-xs uppercase tracking-widest text-sky-300">Prezzo</div>
      <div className="mt-1 text-lg font-semibold">200 AED / file</div>
      <div className="mt-1 text-xs opacity-80">
        Paghi una sola volta per attivare la timbratura su blockchain (valida 24h su questo browser).
      </div>
    </div>
  );
}
