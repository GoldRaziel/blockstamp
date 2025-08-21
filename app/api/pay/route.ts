import { NextResponse } from 'next/server';
import { requireStripe } from '../../../lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let payload: any;
  try {
    // Se manca il body JSON, req.json() lancia: gestiamolo esplicitamente
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Body JSON required. Example: {"amount": 500, "currency":"usd"}' },
      { status: 400 }
    );
  }

  try {
    const {
      amount,
      currency = 'usd',
      description,
      metadata,
      successPath = '/pay/success',
      cancelPath = '/pay/cancel',
    } = payload;

    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'amount (number > 0) required — minor units' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.SITE_URL;
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
