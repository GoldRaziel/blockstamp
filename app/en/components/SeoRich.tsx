export default function SeoRich() {
  const json = {
    "@context":"https://schema.org",
    "@graph":[
      {
        "@type":"Service",
        "name":"Blockstamp — Bitcoin Timestamping",
        "serviceType":"Blockchain timestamping (OpenTimestamps)",
        "provider":{"@type":"Organization","name":"Blockstamp"},
        "areaServed":["AE"],
        "url":"https://blockstamp.ae/en",
        "offers":{"@type":"Offer","priceCurrency":"AED"}
      },
      {
        "@type":"FAQPage",
        "mainEntity":[
          {"@type":"Question","name":"What does a Bitcoin timestamp prove?","acceptedAnswer":{"@type":"Answer","text":"It proves your file’s hash existed at or before a specific Bitcoin block time, providing strong proof of precedence."}},
          {"@type":"Question","name":"Do you store my files?","acceptedAnswer":{"@type":"Answer","text":"No. We only process the SHA-256 fingerprint (hash). Your file stays with you."}},
          {"@type":"Question","name":"Is it legally useful?","acceptedAnswer":{"@type":"Answer","text":"It is widely accepted as digital evidence of prior existence. Use it alongside NDAs and classic IP filings."}}
        ]
      },
      {
        "@type":"HowTo",
        "name":"How to timestamp a file with Blockstamp",
        "step":[
          {"@type":"HowToStep","name":"Upload file","text":"Upload your file; we compute its SHA-256 hash."},
          {"@type":"HowToStep","name":"Anchor on Bitcoin","text":"We create an OpenTimestamps proof anchored to a confirmed Bitcoin block."},
          {"@type":"HowToStep","name":"Download certificate","text":"Download your .ots proof and an official PDF certificate."},
          {"@type":"HowToStep","name":"Verify anytime","text":"Use the Verify page to check the proof publicly at any time."}
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
