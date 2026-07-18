import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="font-sans bg-background text-text-primary min-h-screen">
        {children}
      </body>
    </html>
  );
}
