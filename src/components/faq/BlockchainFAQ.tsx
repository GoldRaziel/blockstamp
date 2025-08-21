import React from "react";

export default function BlockchainFAQ() {
  return (
    <div className="faq-item">
      <h3 className="faq-question">Cosa è una blockchain?</h3>
      <div className="faq-answer">
        <p>
          La <strong>blockchain</strong> è un registro digitale <em>distribuito</em> e{" "}
          <em>immutabile</em>, organizzato in una catena di blocchi. Ogni blocco
          contiene dati (es. transazioni) e l’hash crittografico del blocco
          precedente: questo collegamento rende la catena resistente alle
          manomissioni.
        </p>

        <p><strong>Come funziona (in breve):</strong></p>
        <ol>
          <li><strong>Raccolta dati:</strong> le operazioni vengono raggruppate in un nuovo blocco.</li>
          <li><strong>Hash crittografico:</strong> si calcola un’impronta univoca (hash) del blocco.</li>
          <li><strong>Collegamento:</strong> il blocco include l’hash del blocco precedente, formando la catena.</li>
          <li><strong>Consenso:</strong> la rete di nodi valida/approva il blocco (es. Proof of Work/Stake).</li>
          <li><strong>Immutabilità:</strong> una volta aggiunto, il blocco non può essere alterato senza
              invalidare l’intera catena successiva.</li>
        </ol>

        <ul>
          <li><strong>Decentralizzazione:</strong> nessuna autorità centrale, i nodi condividono lo stesso registro.</li>
          <li><strong>Trasparenza:</strong> lo storico è verificabile pubblicamente (nelle blockchain pubbliche).</li>
          <li><strong>Sicurezza:</strong> crittografia + consenso rendono costosa/difficile la falsificazione.</li>
        </ul>

        <p>
          In sintesi: è come un <em>libro mastro pubblico</em> dove ogni pagina
          (blocco) è collegata alla precedente e approvata dalla comunità. Questo
          permette di registrare informazioni in modo sicuro, verificabile e
          senza intermediari fidati.
        </p>
      </div>
    </div>
  );
}
