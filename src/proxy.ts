// src/proxy.ts — Next.js 16 convention (renamed from middleware.ts)
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18n = createMiddleware(routing);

export default function proxy(request: import('next/server').NextRequest) {
  return handleI18n(request);
}

export const config = {
  matcher: ['/', '/(en|de|fr|it|es|ro|ru|pl|el)/:path*'],
};
