export default function PortalErrorPage() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-2xl font-bold text-red-400 mb-4">ACCESS DENIED</h1>
        <p className="text-sky-100">
          You must complete the payment before accessing this area.
          Please go back to the Home and click <strong>PAY NOW</strong>.
        </p>
      </div>
    </div>
  );
}
