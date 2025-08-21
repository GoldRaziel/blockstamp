import Stripe from 'stripe';

export function requireStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  // Niente apiVersion esplicita per evitare mismatch di tipi in CI (Netlify)
  return new Stripe(key);
}
