import type { Metadata, Viewport } from "next";
import { Archivo, DM_Mono, DM_Sans } from "next/font/google";
import { ViewTransition } from "react";
import { MotionHead } from "@/components/motion/MotionHead";
import { env } from "@/config/env.server";
import { PageShell } from "@/features/shell/PageShell";
import { UiCopyProvider } from "@/components/ui/UiCopy";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSeoDefaults, getSite, getUi } from "@/lib/content";
import { MotionProvider } from "@/lib/motion/MotionProvider";
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

export async function generateMetadata(): Promise<Metadata> {
  const [site, seo] = await Promise.all([getSite(), getSeoDefaults()]);
  return {
    metadataBase: new URL(env.siteUrl),
    title: { default: seo.defaultTitle, template: seo.titleTemplate },
    description: site.description,
    applicationName: site.name,
  };
}

export const viewport: Viewport = {
  themeColor: "#050d14",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [ui, site] = await Promise.all([getUi(), getSite()]);
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <MotionHead />
        <noscript>
          <style>{".boot-overlay{display:none}"}</style>
        </noscript>
      </head>
      <body data-tone="dark">
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Person",
              name: site.name,
              url: env.siteUrl,
              jobTitle: site.role,
              email: site.contact.email,
              address: { "@type": "PostalAddress", addressLocality: site.location.city, addressCountry: site.location.country },
              worksFor: { "@type": "Organization", name: site.agency.name, url: site.agency.url },
              sameAs: site.socials.map((social) => social.url),
            },
            { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: env.siteUrl },
          ]}
        />
        <MotionProvider>
          <UiCopyProvider ui={ui}>
            <PageShell>
              <ViewTransition enter="cut-in" exit="none" default="none">
                {children}
              </ViewTransition>
            </PageShell>
          </UiCopyProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
