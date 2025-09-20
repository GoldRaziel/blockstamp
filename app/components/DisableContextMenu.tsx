"use client";
import { useEffect } from "react";

export default function DisableContextMenu() {
  useEffect(() => {
    const onContext = (e: MouseEvent) => {
      // Blocca solo click destro
      e.preventDefault();
    };

    const onKey = (e: KeyboardEvent) => {
      // Blocca apertura menu contestuale da tastiera: Shift+F10 o tasto "ContextMenu"
      if ((e.shiftKey && (e.key === "F10" || e.code === "F10")) || e.key === "ContextMenu") {
        e.preventDefault();
      }
    };

    const onSelectStart = (e: Event) => {
      const t = e.target as HTMLElement | null;
      // CONSENTI selezione solo nei campi di input/textarea o contenteditable
      if (
        t &&
        (t.closest('input, textarea, [contenteditable="true"]'))
      ) {
        return; // lascia selezionare
      }
      e.preventDefault(); // blocca selezione testo altrove
    };

    const onDragStart = (e: Event) => {
      // Evita trascinamento di immagini/testo
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.closest('input, textarea, [contenteditable="true"]'))
      ) {
        return;
      }
      e.preventDefault();
    };

    document.addEventListener("contextmenu", onContext);
    document.addEventListener("keydown", onKey);
    document.addEventListener("selectstart", onSelectStart);
    document.addEventListener("dragstart", onDragStart);

    return () => {
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("selectstart", onSelectStart);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return null;
}
