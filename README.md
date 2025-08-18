# BLOCKSTAMP — MVP (Next.js 14 + Tailwind)

Sito minimale per **BLOCKSTAMP**: genera l'hash (SHA‑256) del file **in locale** (privacy by design) e produce un `request.json` da inviare per la marcatura su Bitcoin/OTS (flusso manuale iniziale).

## Deploy rapido su Netlify
1. Collega il repo GitHub a Netlify → *New site from Git*.
2. Build: `npm run build` — Publish: `.next`
3. Il plugin `@netlify/plugin-nextjs` è già configurato in `netlify.toml`.

## Sviluppo in Codespaces
Apri il repo in Codespaces e avvia:
