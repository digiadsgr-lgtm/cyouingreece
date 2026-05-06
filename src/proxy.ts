import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export const proxy = createMiddleware(routing);

export const config = {
  matcher: [
    // Match root and all locale-prefixed pages
    '/((?!_next|_vercel|.*\\..*|api|studio).*)'
  ]
};
