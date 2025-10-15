export default function Head() {
  return (
    <>
      {/* Language hints for crawlers; no visual changes */}
      <meta httpEquiv="content-language" content="en" />
      <meta name="language" content="en" />
      <link rel="alternate" href="https://blockstamp.ae/en" hrefLang="en" />
      <link rel="alternate" href="https://blockstamp.ae/" hrefLang="it" />
      <link rel="alternate" href="https://blockstamp.ae/ar" hrefLang="ar" />
      <link rel="alternate" href="https://blockstamp.ae/en" hrefLang="x-default" />
    </>
  );
}
