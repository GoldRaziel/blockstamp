import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['it', 'en', 'ar'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Lascia passare asset, API, build, file statici
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.[a-zA-Z0-9]+$/)
  ) {
    return NextResponse.next();
  }

  // Se il path ha già il locale, non toccare
  if (LOCALES.some(l => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return NextResponse.next();
  }

  // Reindirizza SOLO la root "/" alla lingua di default (/it)
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/it';
    return NextResponse.redirect(url);
  }

  // Altrimenti, non fare nulla
  return NextResponse.next();
}

// Applica il middleware a tutto tranne asset/API
export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
