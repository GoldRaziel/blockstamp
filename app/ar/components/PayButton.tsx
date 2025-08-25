"use client";
import { PAY_TEXTS } from "../lib/content";

type Props = { disabled?: boolean; onClick?: () => void };

export default function PayButton({ disabled, onClick }: Props) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold disabled:opacity-50"
    >
      {PAY_TEXTS.payNow}
    </button>
  );
}
