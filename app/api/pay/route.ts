import { NextResponse } from 'next/server';
import { requireStripe } from '../../../lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Body JSON:
 * {
 *   amount: number,            // minor units (es. 1000 = 10.00)
 *   currency?: string,         // default 'usd'
 *   description?: string,
 *   metadata?: Record<string,string>,
 *   successPath?: string,      // default '/pay/success'
 *   cancelPath?: string        // default '/pay/cancel'
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
      return NextResponse.json({ error: 'amount (number > 0) required — minor units' }, { status: 400 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.SITE_URL; // fallback utile su Netlify

    if (!baseUrl) {
      return NextResponse.json({ error: 'Base URL not set (NEXT_PUBLIC_BASE_URL or SITE_URL)' }, { status: 500 });
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
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      metadata,
      success_url: `${baseUrl}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${cancelPath}`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 });
  }
}
