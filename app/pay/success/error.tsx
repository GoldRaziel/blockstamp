"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold text-white">Ops, qualcosa è andato storto</h1>
        <p className="opacity-80 text-sm">Sto tornando alla Home…</p>
        <a className="underline text-sm" href="/">Vai alla Home</a>
      </div>
      <script dangerouslySetInnerHTML={{__html: 'setTimeout(function(){location.href="/"},800)'}} />
    </div>
  );
}
