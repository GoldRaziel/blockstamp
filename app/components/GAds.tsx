'use client';
import Script from "next/script";

const ADS_ID = "AW-17655044695";

export default function GAds() {
  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`} />
      <Script id="gtag-init" dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ADS_ID}');
        `
      }} />
    </>
  );
}
