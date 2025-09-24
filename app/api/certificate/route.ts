import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

function getStr(p: URLSearchParams, k: string, def = "") {
  const v = p.get(k);
  return v ? v : def;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams;

  // Parametri attesi (per MVP, passati via querystring)
  const lang       = getStr(q, "lang", "it");                 // it | en | ar
  const fileName   = getStr(q, "fileName", "your_file.ext");  // nome originale
  const sha256     = getStr(q, "sha256");                     // hash del file
  const stampCode  = getStr(q, "stampCode");                  // codice timbro Portal
  const block      = getStr(q, "block");                      // numero di blocco
  const txid       = getStr(q, "txid");                       // tx id (se disponibile)
  const tsISO      = getStr(q, "ts", new Date().toISOString());// timestamp ISO (creazione prova)
  const site       = getStr(q, "site", "https://blockstamp.ae");

  if (!sha256 || !stampCode) {
    return NextResponse.json({ error: "Missing required params: sha256, stampCode" }, { status: 400 });
  }

  // Link di verifica (puoi cambiarlo con il tuo percorso VERIFY ufficiale)
  const verifyUrl = `${site.replace(/\/$/, "")}/verify?sha256=${encodeURIComponent(sha256)}${txid ? `&txid=${encodeURIComponent(txid)}` : ""}${block ? `&block=${encodeURIComponent(block)}` : ""}`;

  // Testi per lingue
  const L = {
    it: {
      title: "CERTIFICATO DI PROPRIETÀ / PROVA DI ESISTENZA",
      intro: "Questo certificato attesta la prova di esistenza del seguente file, ancorata alla blockchain di Bitcoin tramite OpenTimestamps.",
      file: "File",
      hash: "SHA-256",
      stamp: "Codice timbro (Portal)",
      block: "Blocco Bitcoin",
      tx: "Transazione",
      ts: "Data/Ora prova",
      verify: "Verifica",
      footer: "Emesso da Blockstamp.ae — Proof of Existence",
    },
    en: {
      title: "CERTIFICATE OF OWNERSHIP / PROOF OF EXISTENCE",
      intro: "This certificate attests to the proof of existence of the following file, anchored to the Bitcoin blockchain via OpenTimestamps.",
      file: "File",
      hash: "SHA-256",
      stamp: "Stamp code (Portal)",
      block: "Bitcoin Block",
      tx: "Transaction",
      ts: "Proof Timestamp",
      verify: "Verify",
      footer: "Issued by Blockstamp.ae — Proof of Existence",
    },
    ar: {
      title: "شهادة ملكية / إثبات وجود",
      intro: "تؤكد هذه الشهادة إثبات وجود الملف التالي، والمثبت على بلوكتشين بيتكوين عبر OpenTimestamps.",
      file: "الملف",
      hash: "SHA-256",
      stamp: "رمز الختم (Portal)",
      block: "كتلة بيتكوين",
      tx: "المعاملة",
      ts: "تاريخ/وقت الإثبات",
      verify: "تحقق",
      footer: "صادر عن Blockstamp.ae — Proof of Existence",
    }
  } as const;

  const T = (L as any)[lang] || L.it;

  // Crea PDF
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4 portrait (pt)
  const { width } = page.getSize();
  const margin = 50;
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = 770;

  // Titolo
  const titleSize = 18;
  const titleWidth = fontBold.widthOfTextAtSize(T.title, titleSize);
  page.drawText(T.title, {
    x: (width - titleWidth) / 2,
    y,
    size: titleSize,
    font: fontBold,
    color: rgb(0.13, 0.65, 0.9),
  });
  y -= 30;

  // Intro
  const introSize = 11;
  const intro = T.intro;
  page.drawText(intro, { x: margin, y, size: introSize, font, color: rgb(1,1,1) });
  y -= 30;

  // Box dati
  const labelSize = 11;
  const valueSize = 11;
  const lineGap = 18;

  function drawKV(label: string, value: string) {
    page.drawText(`${label}:`, { x: margin, y, size: labelSize, font: fontBold, color: rgb(1,1,1) });
    page.drawText(value, { x: margin + 150, y, size: valueSize, font, color: rgb(1,1,1) });
    y -= lineGap;
  }

  drawKV(T.file, fileName);
  drawKV(T.hash, sha256);
  drawKV(T.stamp, stampCode);
  if (block) drawKV(T.block, block);
  if (txid) drawKV(T.tx, txid);
  drawKV(T.ts, tsISO);

  y -= 10;
  // Link verifica
  page.drawText(`${T.verify}: ${verifyUrl}`, {
    x: margin,
    y,
    size: 10,
    font,
    color: rgb(0.8,0.9,1),
  });

  // QR code a destra
  const qrPng = await QRCode.toDataURL(verifyUrl, { margin: 0, width: 256 });
  const qrBase64 = qrPng.split(",")[1];
  const qrBytes = Uint8Array.from(Buffer.from(qrBase64, "base64"));
  const qrImage = await pdf.embedPng(qrBytes);
  const qrSize = 120;
  page.drawImage(qrImage, { x: width - margin - qrSize, y: 640, width: qrSize, height: qrSize });

  // Footer
  page.drawLine({
    start: { x: margin, y: 70 },
    end: { x: width - margin, y: 70 },
    thickness: 0.5,
    color: rgb(1,1,1),
  });
  page.drawText(T.footer, {
    x: margin,
    y: 55,
    size: 9,
    font,
    color: rgb(1,1,1),
  });

  const bytes = await pdf.save();
  const shaShort = sha256.slice(0, 8);
  const filename = `Blockstamp_Certificate_${shaShort}.pdf`;

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
