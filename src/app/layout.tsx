import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata: Metadata = {
  title: "CYouInGreece — The Real Greece",
  description: "Greece is not a destination. It is a feeling. Discover it the way a local would, with Nikos as your guide.",
  keywords: ["Greece travel", "Greek islands", "Santorini", "Athens", "Mykonos", "Greek food", "Nikos guide"],
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
};

import Header from '@/components/Header';
import AnthropicGuide from '@/components/AnthropicGuide';
import SmoothScroller from '@/components/SmoothScroller';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} antialiased bg-[#030b15] text-[#FAF9F6] overflow-x-hidden`}
      >
        <Header />
        <SmoothScroller>
          {children}
        </SmoothScroller>
        <AnthropicGuide />
      </body>
    </html>
  );
}
