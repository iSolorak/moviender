import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-title",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Movieinder",
  description: "Discover your movie taste, one choice at a time.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bebasNeue.variable}`}>{children}</body>
    </html>
  );
}
