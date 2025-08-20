import { Suspense } from "react";
import PaySuccessClient from "./success-client";

export const dynamic = "force-dynamic"; // evita prerender statico

export default function PaySuccessPage() {
  return (
    <main className="container mx-auto px-4 py-10">
      <Suspense fallback={
        <div>
          <h1 className="text-2xl font-semibold">Conferma pagamento…</h1>
          <p className="opacity-80">Attendere qualche secondo…</p>
        </div>
      }>
        <PaySuccessClient />
      </Suspense>
    </main>
  );
}
