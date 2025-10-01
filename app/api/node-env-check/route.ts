export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
export async function GET() {
  const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.length > 10);
  return NextResponse.json({ runtime: 'node', hasStripeSecretKey: hasStripe });
}
