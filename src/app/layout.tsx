import type { Metadata, Viewport } from "next";
import { Archivo, DM_Mono, DM_Sans } from "next/font/google";
import { env } from "@/config/env.server";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--next-font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--next-font-body",
  display: "swap",
});

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--next-font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: "Samiul Arafat Imon",
};

export const viewport: Viewport = {
  themeColor: "#050d14",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body data-tone="dark">{children}</body>
    </html>
  );
}
