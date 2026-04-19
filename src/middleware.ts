// src/proxy.ts — renamed from middleware.ts per Next.js 16 convention
// The function must be named `proxy` (not `default`) per the new API
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18n = createMiddleware(routing);

export default function middleware(request: import('next/server').NextRequest) {
  return handleI18n(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|de|fr|it|es|ro|ru|pl|el)/:path*'],
};
