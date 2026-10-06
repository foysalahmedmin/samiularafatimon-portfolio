import type { Metadata } from "next";

type PageMeta = {
  title: string;
  description: string;
  /** Path of the page, e.g. "/about". Resolved against metadataBase. */
  path: string;
  keywords?: string[] | undefined;
  /** Use the title exactly as given (the home page) instead of the "%s | Name" template. */
  absoluteTitle?: boolean;
};

/** Title, description, canonical, Open Graph and Twitter tags for one page. */
export function pageMetadata({ title, description, path, keywords, absoluteTitle = false }: PageMeta): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: { type: "website", title, description, url: path },
    twitter: { card: "summary_large_image", title, description },
  };
}
