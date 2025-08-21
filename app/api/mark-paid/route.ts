import { NextResponse } from 'next/server';
import { requireStripe } from '../../../lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const stripe = requireStripe();

    let paid = false;
    let source: 'checkout.session' | 'payment_intent' | 'unknown' = 'unknown';

    if (body?.sessionId) {
      const session = await stripe.checkout.sessions.retrieve(body.sessionId);
      paid = session.payment_status === 'paid' || session.status === 'complete';
      source = 'checkout.session';
    } else if (body?.paymentIntentId) {
      const pi = await stripe.paymentIntents.retrieve(body.paymentIntentId);
      paid = pi.status === 'succeeded' || pi.status === 'requires_capture' || pi.status === 'processing';
      source = 'payment_intent';
    } else {
      return NextResponse.json({ error: 'Provide sessionId or paymentIntentId' }, { status: 400 });
    }

    // TODO: aggiorna qui il tuo DB se necessario
    return NextResponse.json({ ok: true, paid, source });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 });
  }
}
