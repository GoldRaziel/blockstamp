import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['en', 'it', 'ar'];

export function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  // Escludi asset/API/statici
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/favicon') ||
    /\.\w+$/.test(pathname) // file con estensione
  ) {
    return NextResponse.next();
  }

  // Se manca il prefisso locale, forziamo EN
  const hasLocale = LOCALES.some((loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`));

  if (!hasLocale) {
    // Caso speciale: /portal -> /en/portal (e sotto-route)
    if (pathname === '/portal' || pathname.startsWith('/portal/')) {
      const url = nextUrl.clone();
      url.pathname = `/en${pathname}`;
      return NextResponse.redirect(url);
    }

    const url = nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Applica a tutte le route tranne statiche e API
export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
