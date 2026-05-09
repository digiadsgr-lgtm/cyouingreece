import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { Analytics } from "@vercel/analytics/next";

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

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7060949710564119"
          crossOrigin="anonymous"
        ></script>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KH4LD998');
          `}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} antialiased bg-[#030b15] text-[#FAF9F6] overflow-x-hidden`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-KH4LD998"
            height="0" 
            width="0" 
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <NextIntlClientProvider messages={messages}>
          <Header />
          <SmoothScroller>
            {children}
          </SmoothScroller>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
