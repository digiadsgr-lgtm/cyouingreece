import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export const proxy = createMiddleware(routing);

export const config = {
  matcher: [
    // Match all locale-prefixed paths, but EXCLUDE the absolute root (/)
    // so that the verification bot can read our fo-verify meta tag in app/page.tsx
    '/((?!_next|_vercel|.*\\..*|api|studio|^/$).*)'
  ]
};
