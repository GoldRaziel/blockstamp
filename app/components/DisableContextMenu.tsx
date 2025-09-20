"use client";
import { useEffect } from "react";

export default function DisableContextMenu() {
  useEffect(() => {
    const onContext = (e: MouseEvent) => {
      e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      // Blocca apertura menu da tastiera: Shift+F10 e tasto "ContextMenu"
      if ((e.shiftKey && (e.key === "F10" || e.code === "F10")) || e.key === "ContextMenu") {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", onContext);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  return null;
}
