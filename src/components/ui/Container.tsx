import { createElement, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = {
  as?: "div" | "section" | "header" | "footer" | "nav";
  className?: string;
  /** Use the full width (no max width), keeping the side gutters. */
  wide?: boolean;
  children: ReactNode;
};

export function Container({ as = "div", className, wide = false, children }: ContainerProps) {
  return createElement(
    as,
    { className: cn("mx-auto w-full px-(--gutter)", !wide && "max-w-(--container)", className) },
    children,
  );
}
