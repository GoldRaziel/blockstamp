import { usePathname } from "next/navigation";
"use client";
import { redirect } from "next/navigation";

export default async function SuccessPage({ searchParams }: { searchParams: { session_id?: string }}) {
  const session_id = searchParams?.session_id;
  if (!session_id) redirect("/?error=missing_session");

  // IMPORTANTISSIMO: redirigiamo il BROWSER all'API che setta il cookie
  redirect(`/api/confirm?session_id=${encodeURIComponent(session_id)}`);
}
