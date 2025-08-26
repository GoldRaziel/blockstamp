"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function RootNavGate() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/en") || pathname.startsWith("/ar")) {
    // Siamo in una route locale: lascia che i layout EN/AR rendano la loro navbar
    return null;
  }
  // Route italiana: mostra la navbar IT
  return <Navbar />;
}
