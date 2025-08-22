"use client";
import PayButton from "../components/PayButton";

export default function PayPage() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Attiva TIMBRA</h1>
      <p className="opacity-80">Completa il pagamento per sbloccare la pagina protetta <code>/timbra</code>.</p>
      <PayButton label="💳 Paga ora" />
      <p className="text-sm opacity-70">
        Dopo il pagamento verrai reindirizzato automaticamente alla pagina <strong>/timbra</strong>.
      </p>
    </div>
  );
}
