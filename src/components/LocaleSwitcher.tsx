'use client';

import {useLocale, useTranslations} from 'next-intl';
import {routing, usePathname, useRouter} from '@/i18n/routing';
import {useParams} from 'next/navigation';
import {ChangeEvent, useTransition} from 'react';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale});
    });
  }

  return (
    <div className="relative group">
      <select
        defaultValue={locale}
        disabled={isPending}
        onChange={onSelectChange}
        className="bg-transparent text-[10px] uppercase tracking-[0.2em] font-bold text-white/70 hover:text-[#D4A027] outline-none cursor-pointer appearance-none border-b border-white/20 pb-0.5 transition-colors"
      >
        {routing.locales.map((cur) => (
          <option key={cur} value={cur} className="bg-[#030b15] text-white">
            {cur.toUpperCase()}
          </option>
        ))}
      </select>
      <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#D4A027] transition-all duration-300 group-hover:w-full" />
    </div>
  );
}
