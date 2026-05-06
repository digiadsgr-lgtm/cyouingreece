import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'el', 'de', 'fr', 'it', 'es', 'ro', 'nl', 'no', 'sv', 'da', 'fi'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);
