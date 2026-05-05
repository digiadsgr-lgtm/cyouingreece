import {defineRouting} from 'next-intl/routing';
import {createSharedPathnamesNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'el', 'de', 'fr', 'it', 'es', 'ro', 'nl', 'no', 'sv', 'da', 'fi'],
  defaultLocale: 'en'
});

export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation(routing);
