import type { Metadata } from "next";
import { EB_Garamond, Figtree } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "PulseBoard | Real-Time Market Analytics",
    template: "%s | PulseBoard",
  },
  description: "Real-time market intelligence dashboard tracking live prices, historical volume trends, and operator watchlists for major cryptocurrencies.",
  metadataBase: new URL("https://pulseboard-demo.vercel.app"),
  openGraph: {
    title: "PulseBoard | Real-Time Market Analytics",
    description: "Streamlined financial telemetry. Monitor assets, visualize trends, and build private watchlists in a single workspace.",
    url: "https://pulseboard-demo.vercel.app",
    siteName: "PulseBoard",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseBoard | Real-Time Market Analytics",
    description: "Streamlined financial telemetry. Monitor assets, visualize trends, and build private watchlists in a single workspace.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ebGaramond.variable} ${figtree.variable} antialiased`} suppressHydrationWarning>
      <body className="font-sans bg-background text-ink min-h-screen" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
