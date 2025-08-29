import Stripe from "stripe";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ===== i18n helpers ===== */
type Loc = "it" | "en" | "ar";
function detectLocale_OLD(req: NextRequest): Loc {
  // 1) locale dal client (header esplicito)
  const xl = (req.headers.get("x-locale") || "").toLowerCase();
  if (xl === "en" || xl.startsWith("en")) return "en";
  if (xl === "ar" || xl.startsWith("ar")) return "ar";

  // 2) fallback: deduci dal Referer (es. https://blockstamp.ae/ar/portal)
  const ref = req.headers.get("referer") || "";
  try {
    const u = new URL(ref);
    const seg = u.pathname.split("/")[1]?.toLowerCase();
    if (seg === "en" || seg === "ar") return seg as Loc;
  } catch {}

  // 3) fallback: Accept-Language
  const al = (req.headers.get("accept-language") || "").toLowerCase();
  if (al.startsWith("en")) return "en";
  if (al.startsWith("ar")) return "ar";

  return "it";
}

function detectLocale(req: NextRequest): Loc {
  const xl = (req.headers.get("x-locale") || "").toLowerCase();
  if (xl === "en" || xl.startsWith("en")) return "en";
  if (xl === "ar" || xl.startsWith("ar")) return "ar";

  const seg = new URL(req.url).pathname.split("/")[1]?.toLowerCase();
  if (seg === "en" || seg === "ar") return seg;

  const al = (req.headers.get("accept-language") || "").toLowerCase();
  if (al.startsWith("en")) return "en";
  if (al.startsWith("ar")) return "ar";

  return "it";
}

function t(loc: Loc) {
  switch (loc) {
    case "en":
      return {
        MISSING_ZIP: "Missing .zip file",
        ONLY_ZIP: "Only .zip files are allowed",
        MISSING_TXT:
          "Your .zip must include a text file (.txt) containing the SHA-256 code generated on Home.",
        OTS_URL_MISSING: "OTS_SERVICE_URL is not configured",
        OTS_CONN_FAIL: "Failed to connect to the OTS service",
        OTS_ERR_PREFIX: "OTS error: ",
      };

/** Ritorna la frase MISSING_TXT tenendo conto del contesto AR:
 *  - se la richiesta proviene da /ar/... (Referer), forza l'inglese
 *  - altrimenti usa la lingua già rilevata (loc)
 */
function missingTxtFor(req: NextRequest, loc: Loc): string {
  const ref = req.headers.get("referer") || "";
  try {
    const u = new URL(ref);
    const isAr = u.pathname.split("/")[1]?.toLowerCase() === "ar";
    if (isAr) {
      // forza inglese per la frase MISSING_TXT in contesto AR
      return t("en").MISSING_TXT;
    }
  } catch {}
  return t(loc).MISSING_TXT;
}

    case "ar":
      // Richiesta: in AR, lasciare il messaggio *in inglese* per la mancanza del .txt
      return {
        MISSING_ZIP: "ملف ‎.zip مفقود",
        ONLY_ZIP: "يُسمح فقط بملفات ‎.zip",
        MISSING_TXT:
          "Your .zip must include a text file (.txt) containing the SHA-256 code generated on Home.",
        OTS_URL_MISSING: "لم يتم ضبط OTS_SERVICE_URL",
        OTS_CONN_FAIL: "فشل الاتصال بخدمة OTS",
        OTS_ERR_PREFIX: "خطأ OTS: ",
      };
    default:
      return {
        MISSING_ZIP: "File .zip mancante",
        ONLY_ZIP: "Sono ammessi solo file .zip",
        MISSING_TXT:
          "Nel file .zip deve essere presente un file di testo (.txt) con il codice SHA-256 generato in Home.",
        OTS_URL_MISSING: "OTS_SERVICE_URL non configurato",
        OTS_CONN_FAIL: "Connessione al servizio OTS non riuscita",
        OTS_ERR_PREFIX: "Errore OTS: ",
      };
  }
}

// RTL wrapper smart: applica RLI/PDI solo se la stringa contiene caratteri arabi
function rtlWrap(loc: Loc, s: string) {
  const hasArabic = /[\u0600-\u06FF]/.test(s);
  return loc === "ar" && hasArabic ? `\u2067${s}\u2069` : s;
}

/* ===== ZIP check: esiste almeno un .txt nell'archivio? ===== */
function zipHasTxtFile(buf: Buffer): boolean {
  const SIG = 0x02014b50; // PK\x01\x02 (central directory)
  let i = 0;
  while (i + 46 <= buf.length) {
    if (buf.readUInt32LE(i) === SIG) {
      const nameLen = buf.readUInt16LE(i + 28);
      const extraLen = buf.readUInt16LE(i + 30);
      const commentLen = buf.readUInt16LE(i + 32);
      const nameStart = i + 46;
      const nameEnd = nameStart + nameLen;
      if (nameEnd > buf.length) break;
      const filename = buf.slice(nameStart, nameEnd).toString("utf8");
      if (filename.toLowerCase().endsWith(".txt")) return true;
      i = nameEnd + extraLen + commentLen;
      continue;
    }
    i += 1;
  }
  return false;
}

export async function POST(req: NextRequest) {
  const loc = detectLocale(req);
  const L = t(loc);

  // ==== BS_AUTH_START ====
  const cookieOk = cookies().get("bs_portal")?.value === "ok";
  let authorized = !!cookieOk;
  try {
    if (!authorized) {
      const u = new URL(req.url);
      const sid = u.searchParams.get("session_id") || "";
      if (sid && process.env.STRIPE_SECRET_KEY) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
        const s = await stripe.checkout.sessions.retrieve(sid);
        authorized = s.payment_status === "paid";
      }
    }
    if (!authorized && process.env.PORTAL_BYPASS_ENABLED === "true") {
      const u = new URL(req.url);
      const key = u.searchParams.get("key") || req.headers.get("x-portal-bypass-key") || "";
      if (key && key === (process.env.PORTAL_BYPASS_KEY || "")) authorized = true;
    }
  } catch { /* ignore */ }
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ==== BS_AUTH_END ====

  const form = await req.formData();
  const file = form.get("zip");
  if (!(file instanceof File)) {
    return new NextResponse(rtlWrap(loc, L.MISSING_ZIP), {
      status: 400,
      headers: { "Content-Language": loc },
    });
  }
  if (!file.name.toLowerCase().endsWith(".zip")) {
    return new NextResponse(rtlWrap(loc, L.ONLY_ZIP), {
      status: 400,
      headers: { "Content-Language": loc },
    });
  }

  const buf = Buffer.from(await (file as File).arrayBuffer());

  // obbligo del .txt nello ZIP
  if (!zipHasTxtFile(buf)) {
    return new NextResponse(rtlWrap(loc, L.MISSING_TXT), {
      status: 400,
      headers: { "Content-Language": loc },
    });
  }

  // receiptCode = SHA-256 dello ZIP
  const receiptCode = crypto.createHash("sha256").update(buf).digest("hex");

  const otsUrl = process.env.OTS_SERVICE_URL;
  if (!otsUrl) {
    return new NextResponse(rtlWrap(loc, L.OTS_URL_MISSING), {
      status: 500,
      headers: { "Content-Language": loc },
    });
  }

  const fd = new FormData();
  fd.append("file", new Blob([buf], { type: "application/zip" }), file.name);

  let upstream: Response;
  try {
    upstream = await fetch(otsUrl, { method: "POST", body: fd });
  } catch {
    return new NextResponse(rtlWrap(loc, L.OTS_CONN_FAIL), {
      status: 502,
      headers: { "Content-Language": loc },
    });
  }
  if (!upstream.ok) {
    const text = await upstream.text();
    return new NextResponse(rtlWrap(loc, `${L.OTS_ERR_PREFIX}${text}`), {
      status: 502,
      headers: { "Content-Language": loc },
    });
  }

  const otsBlob = await upstream.blob();

  const res = new NextResponse(otsBlob, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="blockstamp_receipt.ots"',
      "x-receipt-code": receiptCode,
      "Cache-Control": "no-store",
      "Content-Language": loc,
    },
  });

  // opzionale: invalida 'paid' usa-una-volta
  res.cookies.set({
    name: "paid",
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
