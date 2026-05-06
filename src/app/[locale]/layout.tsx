import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata: Metadata = {
  title: "CYouInGreece — The Real Greece",
  description: "Greece is not a destination. It is a feeling. Discover it the way a local would, with Nikos as your guide.",
  keywords: ["Greece travel", "Greek islands", "Santorini", "Athens", "Mykonos", "Greek food", "Nikos guide"],
  verification: {
    google: "ca-pub-7060949710564119",
    other: {
      "fo-verify": "398cfa48-ee3f-4e88-af21-ea8479711be2",
    },
  },
  openGraph: {
    title: "CYouInGreece — See You In Greece",
    description: "The smell of oregano on a hillside at dusk. A fishing boat that hasn't moved since 1987. This is Greece the way a friend shows it to you.",
    url: "https://cyouingreece.com",
    siteName: "CYouInGreece",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CYouInGreece — The Real Greece",
    description: "The travel site that makes you close your laptop and book a flight to Greece.",
  },
  robots: { index: true, follow: true },
  other: {
    "google-adsense-account": "ca-pub-7060949710564119",
  }
};

import Header from '@/components/Header';
import SmoothScroller from '@/components/SmoothScroller';

// GetYourGuide Partner ID
const GYG_PARTNER_ID = "0PODFZZ";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta name="fo-verify" content="398cfa48-ee3f-4e88-af21-ea8479711be2" />
        {/* GetYourGuide Analytics — required for widget rendering and affiliate tracking */}
        <Script
          src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
          data-gyg-partner-id={GYG_PARTNER_ID}
          strategy="afterInteractive"
        />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7060949710564119"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} antialiased bg-[#030b15] text-[#FAF9F6] overflow-x-hidden`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          <SmoothScroller>
            {children}
          </SmoothScroller>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
