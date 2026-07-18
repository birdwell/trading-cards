import type { Metadata } from "next";
import { Geist, Syne } from "next/font/google";
import { Providers } from "../components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Almanac",
  description: "Track your trading card collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${syne.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
