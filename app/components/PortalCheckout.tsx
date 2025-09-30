'use client';
import React from 'react';

type Props = {
  lang: 'it' | 'en' | 'ar';
  label?: string;
  className?: string;
};

export default function PortalCheckout({ lang, label = 'Pay now', className = '' }: Props) {
  const [loading, setLoading] = React.useState(false);
  const onClick = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/checkout-portal?lang=${lang}`, { method: 'GET' });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url as string;
      } else {
        alert(data?.error || 'Unable to start checkout');
        setLoading(false);
      }
    } catch (e: any) {
      alert(e?.message || 'Network error');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold shadow ${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {loading ? (lang === 'it' ? 'Attendere…' : lang === 'ar' ? 'جارٍ المعالجة…' : 'Please wait…') : label}
    </button>
  );
}
