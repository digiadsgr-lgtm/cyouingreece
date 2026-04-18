import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";

import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

import SmoothScroller from '@/components/SmoothScroller';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata: Metadata = {
  title: "CYouInGreece - The Ultimate Hellenic Voyage",
  description: "Curated experiences and intelligence across the Aegean",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
 
  const messages = await getMessages();
 
  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${playfair.variable} antialiased selection:bg-[#003366] selection:text-white bg-[#FCFDFF] text-[#1E293B] overflow-x-hidden`}>
        <NextIntlClientProvider messages={messages}>
          <SmoothScroller>
            {children}
          </SmoothScroller>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
