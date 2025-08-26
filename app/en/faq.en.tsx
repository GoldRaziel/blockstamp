<section id="faq" className="space-y-4">
  <h2 className="text-3xl font-semibold">FAQ</h2>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">What is a blockchain?</summary>
    <div className="mt-2 text-sm opacity-90 space-y-2">
      <p>
        A <b>blockchain</b> is a <i>distributed</i>, <i>append-only</i> ledger: a chain of blocks where each block
        contains data (e.g., transactions) and the cryptographic hash of the previous block. This linkage makes the
        whole chain tamper-resistant.
      </p>
      <p className="font-medium">How it works (quickly):</p>
      <ol className="list-decimal pl-5 space-y-1">
        <li>Operations are grouped into a new block.</li>
        <li>A unique fingerprint (hash) of the block is computed.</li>
        <li>The block includes the previous block’s hash, forming the chain.</li>
        <li>The network approves the block via <i>consensus</i> (e.g., Proof of Work/Stake).</li>
        <li>Once added, changing it would require rewriting all subsequent blocks.</li>
      </ol>
      <ul className="list-disc pl-5 space-y-1">
        <li><b>Decentralization:</b> no central authority; many nodes share the same ledger.</li>
        <li><b>Transparency:</b> on public chains the history is verifiable by anyone.</li>
        <li><b>Security:</b> cryptography + consensus make forgery extremely hard.</li>
      </ul>
      <p>
        In practice, it’s like a <i>public ledger</i> where every page (block) is linked to the previous one and
        approved by the network — a reliable way to record information without trusting an intermediary.
      </p>
    </div>
  </details>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">Do you upload or store my file?</summary>
    <p className="mt-2 text-sm opacity-90">
      No. The fingerprint is computed locally in your browser. We only record the fingerprint (non-reversible).
    </p>
  </details>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">What does the blockchain proof show?</summary>
    <p className="mt-2 text-sm opacity-90">
      It proves that content with <b>that specific fingerprint</b> was recorded on Bitcoin at least by the reference
      date. It does not reveal the content and does not certify your identity.
    </p>
  </details>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">How do I verify later?</summary>
    <p className="mt-2 text-sm opacity-90">
      Recompute the fingerprint of the original file and compare it to the one included in the proof. If they match,
      you have integrity and a public reference on Bitcoin.
    </p>
  </details>

  <details className="bg-white/5 border border-white/10 rounded-2xl p-4">
    <summary className="cursor-pointer font-medium">What if I lose the file?</summary>
    <p className="mt-2 text-sm opacity-90">
      The fingerprint cannot reconstruct the content. Keep safe backups of the original file: the proof demonstrates
      existence and integrity; it does not recover the content.
    </p>
  </details>
</section>
