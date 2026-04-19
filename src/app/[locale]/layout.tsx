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
  title: "CYouInGreece | Exclusive Hellenic Sanctuaries",
  description: "Bypass the noise. The most guarded private yachts, villas, and isolated nodes in the Aegean, curated by AI intelligence.",
  keywords: ["Luxury Greece", "Private Yachts Aegean", "Hellenic Architecture", "Luxury Villas Mykonos", "High Net Worth Travel", "Concierge Greece"],
  openGraph: {
    title: "CYouInGreece | Exclusive Sanctuaries",
    description: "The most guarded private yachts and isolated topological nodes in the Aegean.",
    url: "https://cyouingreece.com",
    siteName: "CYouInGreece",
    images: [
      {
        url: "/bg-hero.png", // Will use our 4K background image
        width: 2000,
        height: 1000,
        alt: "CYouInGreece Luxury Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CYouInGreece | Exclusive Hellenic Sanctuaries",
    description: "The most guarded private yachts and isolated topological nodes in the Aegean.",
    images: ["/bg-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import Header from '@/components/Header';
import AnthropicGuide from '@/components/AnthropicGuide';

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
      <body suppressHydrationWarning className={`${inter.variable} ${playfair.variable} antialiased selection:bg-brand-golden selection:text-black bg-brand-navy text-brand-white overflow-x-hidden`}>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <SmoothScroller>
            {children}
          </SmoothScroller>
          <AnthropicGuide />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
