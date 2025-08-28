import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Evita redirect se la lingua è già presente
  const isLocaleSet = pathname.startsWith('/en') || pathname.startsWith('/it') || pathname.startsWith('/ar');

  if (!isLocaleSet && pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  if (!isLocaleSet && pathname === '/portal') {
    return NextResponse.redirect(new URL('/en/portal', request.url));
  }

  return NextResponse.next();
}
