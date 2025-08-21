"use client";

export default function SuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-white">Pagamento completato</h1>
        <p className="opacity-80">Grazie! Stiamo tornando alla Home…</p>
        <a className="underline text-sm" href="/">Vai alla Home</a>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: 'setTimeout(function(){location.href="/"},1200)'
        }}
      />
    </div>
  );
}
