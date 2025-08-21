import { NextResponse } from 'next/server';
import { requireStripe } from '../../../lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Body JSON accettato:
 * {
 *   amount: number,            // in minor units (es. 1000 = 10.00)
 *   currency?: string,         // default 'usd'
 *   description?: string,
 *   metadata?: Record<string,string>,
 *   successPath?: string,      // opzionale, default '/pay/success'
 *   cancelPath?: string        // opzionale, default '/pay/cancel'
 * }
 */
export async function POST(req: Request) {
  try {
    const {
      amount,
      currency = 'usd',
      description,
      metadata,
      successPath = '/pay/success',
      cancelPath = '/pay/cancel',
    } = await req.json();

    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'amount (number > 0) required — in minor units' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json({ error: 'NEXT_PUBLIC_BASE_URL is not set' }, { status: 500 });
    }

    const stripe = requireStripe();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: description || 'Blockstamp order' },
            unit_amount: amount, // minor units
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      metadata,
      success_url: `${baseUrl}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${cancelPath}`,
    });

    // Restituisco sia l'url (redirect lato client) sia l'id (per verifiche server)
    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 });
  }
}
