import { Crimson_Pro, Playfair_Display, IM_Fell_English } from 'next/font/google';
import { Providers }    from './providers';
import './globals.css';

const crimsonPro = Crimson_Pro({ 
  subsets: ["latin"],
  variable: '--font-crimson',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
});

const imFellEnglish = IM_Fell_English({
  weight: ['400'],
  style: ['italic'],
  subsets: ["latin"],
  variable: '--font-im-fell',
  display: 'swap',
  adjustFontFallback: false,
});

export const metadata = {
  title:       "Pharma Khabri — India's Journal of Pharmaceutical Intelligence",
  description: "Daily news on FDA approvals, clinical trials, biotech, and drug regulations.",
  openGraph: { type: "website" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${crimsonPro.variable} ${playfairDisplay.variable} ${imFellEnglish.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}