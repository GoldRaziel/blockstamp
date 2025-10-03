import os, re, base64, tempfile, subprocess, hashlib
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse

app = FastAPI(title="OTS Upgrade & Verify")

def run(cmd: list[str], timeout: int = 25):
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    try:
        out, err = p.communicate(timeout=timeout)
    except subprocess.TimeoutExpired:
        p.kill()
        out, err = p.communicate()
        return 124, out, err
    return p.returncode, out, err

def sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024*1024), b""):
            h.update(chunk)
    return h.hexdigest()

@app.get("/health")
def health():
    return {"ok": True, "service": "ots-upgrade-verify"}

@app.post("/api/ots/upgrade-verify")
async def upgrade_verify(
    ots: UploadFile = File(..., description="File .ots"),
    target: UploadFile | None = File(None, description="File originale (es. .zip)"),
):
    """
    - Tenta l'upgrade della .ots
    - Usa `ots info <proof.ots>` per estrarre le attestazioni Bitcoin.
    - Se ci sono più BitcoinBlockHeaderAttestation, scegli la più bassa (ancoraggio più precoce)
      e ritorna anche la lista completa.
    - Se 'target' è presente, calcola SHA-256 del file e lo ritorna.
    """
    with tempfile.TemporaryDirectory() as tmp:
        # Salva la .ots
        ots_path = os.path.join(tmp, "proof.ots")
        with open(ots_path, "wb") as f:
            f.write(await ots.read())

        # (Opzionale) target + sha256
        target_sha256 = None
        if target is not None:
            target_path = os.path.join(tmp, "target.bin")
            with open(target_path, "wb") as f:
                f.write(await target.read())
            target_sha256 = sha256_file(target_path)

        # Upgrade best-effort
        rc_u, out_u, err_u = run(["ots", "upgrade", ots_path], timeout=20)
        upgraded = (rc_u == 0)

        # Info
        rc_i, out_i, err_i = run(["ots", "info", ots_path], timeout=25)
        stdout, stderr = out_i, err_i
        text_all = (stdout or "") + "\n" + (stderr or "")

        # Estrai TUTTE le altezze di blocco stampate dalla CLI
        # Cattura sia pattern "BitcoinBlockHeaderAttestation(917074)" sia "Bitcoin block ... 917074"
        heights = set()
        for m in re.findall(r"BitcoinBlockHeaderAttestation\((\d{5,7})\)", text_all):
            try:
                heights.add(int(m))
            except:  # pragma: no cover
                pass
        for m in re.findall(r"(?:Bitcoin\s+block|block\s*(?:height)?)\D{0,20}(\d{5,7})", text_all, re.IGNORECASE):
            try:
                heights.add(int(m))
            except:
                pass

        earliest_height = min(heights) if heights else None

        # Stato
        pending = bool(re.search(r"PendingAttestation|pending|not\s+upgraded|no\s+attestation", text_all, re.IGNORECASE))
        if rc_i == 0 and earliest_height is not None:
            status = "confirmed"
        elif rc_i == 0 and pending:
            status = "pending"
        elif rc_i == 0:
            status = "ok"
        else:
            status = "error"

        # .ots (potenzialmente aggiornata)
        with open(ots_path, "rb") as pf:
            ots_bytes = pf.read()
        ots_b64 = base64.b64encode(ots_bytes).decode("ascii")

        return JSONResponse(
            {
                "ok": rc_i == 0,
                "status": status,
                "block_height": earliest_height,      # ancoraggio più precoce (es. 917074)
                "all_block_heights": sorted(heights), # tutte le attestazioni trovate
                "upgraded_attempted": upgraded,
                "stdout": stdout,
                "stderr": stderr,
                "ots_base64": ots_b64,
                "ots_filename": "proof.upgraded.ots" if upgraded else "proof.ots",
                "target_sha256": target_sha256,
                "verification_mode": "info_proof",
            },
            status_code=200 if rc_i == 0 else 400,
        )
