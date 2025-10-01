import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import PortalClient from "./PortalClient";

const COOKIE = process.env.PORTAL_COOKIE_NAME || "bs_portal_v2";
const TTL = parseInt(process.env.PORTAL_COOKIE_TTL || "172800", 10);

// Copia della deriveSecret usata in middleware.ts
function deriveSecret(): Uint8Array | null {
  const sk = process.env.STRIPE_SECRET_KEY || "";
  if (!sk) return null;
  const data = new TextEncoder().encode(sk + "::portal");
  let h = 2166136261 >>> 0;
  for (let i = 0; i < data.length; i++) { h ^= data[i]; h = Math.imul(h, 16777619) >>> 0; }
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) bytes[i] = (h = Math.imul(h ^ i, 16777619) >>> 0) & 0xff;
  return bytes;
}

export const dynamic = "force-dynamic";

export default async function PortalPageServer() {
  const secret = deriveSecret();
  if (!secret) redirect("/en/");

  const token = cookies().get(COOKIE)?.value || null;
  if (!token) redirect("/en/");

  try {
    await jwtVerify(token, secret, { algorithms: ["HS256"] });
  } catch {
    redirect("/en/");
  }

  // Autorizzato → renderizza il client
  return <PortalClient />;
}
