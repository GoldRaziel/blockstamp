import { redirect } from "next/navigation";

export default async function SuccessPage({ searchParams }: { searchParams: { session_id?: string }}) {
  const session_id = searchParams?.session_id;
  if (!session_id) redirect("/?error=missing_session");
  // Deleghiamo la logica all'API; questa chiamata in pratica verrà rimpiazzata da una redirect server-side
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/confirm?session_id=${encodeURIComponent(session_id)}`;
  await fetch(url, { cache: "no-store" });
  redirect("/portal");
}
