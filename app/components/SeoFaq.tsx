"use client";
import React from "react";

export default function SeoFaq() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Come funziona la protezione dei diritti intellettuali con Blockstamp?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Crei l'hash locale del file e ottieni una marca temporale pubblica su Bitcoin tramite OpenTimestamps. Il certificato scaricabile collega il tuo file al timestamp verificabile."
        }
      },
      {
        "@type": "Question",
        "name": "La marca temporale su Bitcoin è valida come prova?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La marca temporale fornisce prova di esistenza con data certa. L’attendibilità tecnica è verificabile pubblicamente; la rilevanza giuridica dipende dal contesto e dal giudice competente."
        }
      },
      {
        "@type": "Question",
        "name": "Quali opere posso tutelare?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Immagini, testi, musica, video, progetti, software e ogni file digitale. Il contenuto non viene caricato né condiviso: si usa solo l’hash."
        }
      },
      {
        "@type": "Question",
        "name": "Quanto costa e quanto tempo richiede?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Il processo è immediato lato utente. La finalizzazione della prova on-chain avviene in seguito, ma la ricevuta/attestazione è disponibile subito."
        }
      },
      {
        "@type": "Question",
        "name": "Posso verificare pubblicamente il timbro?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sì. Puoi usare la funzione Verify del sito o gli strumenti OpenTimestamps per convalidare la prova in autonomia."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
