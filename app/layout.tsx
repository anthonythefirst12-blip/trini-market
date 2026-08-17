import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { BackToTop } from "@/components/ui/BackToTop";
import { PingPresence } from "@/components/PingPresence";
import { ActivityToast } from "@/components/ui/ActivityToast";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trinisell.tt"),
  title: {
    default: "TriniSell – Buy & Sell Locally in Trinidad & Tobago",
    template: "%s | TriniSell",
  },
  description: "Buy and sell locally in Trinidad & Tobago. Find vehicles, electronics, real estate, fashion, services and more.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TriniSell",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  openGraph: {
    siteName: "TriniSell",
    locale: "en_TT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@trinisell",
  },
};

export const viewport = {
  themeColor: "#dc2626",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);if(t==='dark'){document.documentElement.style.backgroundColor='#111111';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieBanner />
            <BackToTop />
            <PingPresence />
            <ActivityToast />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
