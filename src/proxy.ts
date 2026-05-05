import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export const proxy = createMiddleware(routing);

export const config = {
  matcher: ['/', '/(de|el|en|es|fr|it|ro|nl|no|sv|da|fi)/:path*']
};
