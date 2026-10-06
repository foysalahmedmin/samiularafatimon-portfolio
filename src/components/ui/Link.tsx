import NextLink from "next/link";
import type { ComponentPropsWithRef, ReactNode } from "react";

export const isExternal = (href: string) => /^https?:\/\//.test(href);
export const isSpecial = (href: string) => /^(mailto:|tel:)/.test(href);

type SmartLinkProps = Omit<ComponentPropsWithRef<"a">, "href"> & {
  href: string;
  /** Screen-reader suffix for links that open a new tab, e.g. "opens in a new tab". */
  externalLabel?: string;
  children?: ReactNode;
};

/**
 * One link component for everything: internal paths use next/link (prefetch, transitions),
 * external URLs open in a new tab safely, mailto:/tel:/#hash are plain anchors.
 */
export function SmartLink({ href, externalLabel, children, ...props }: SmartLinkProps) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
        {externalLabel ? <span className="sr-only"> ({externalLabel})</span> : null}
      </a>
    );
  }
  if (isSpecial(href) || href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <NextLink href={href} {...props}>
      {children}
    </NextLink>
  );
}

/** Text link with an underline that wipes in from the left and out to the right. */
export function TextLink({ className, ...props }: SmartLinkProps) {
  return <SmartLink className={`u-link ${className ?? ""}`} {...props} />;
}
