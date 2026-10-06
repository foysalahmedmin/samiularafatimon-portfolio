import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/cn";
import { ArrowRight, ArrowUpRight } from "./Icons";
import { isExternal, SmartLink } from "./Link";

type Variant = "primary" | "secondary" | "ghost";

type CommonProps = {
  variant?: Variant;
  size?: "md" | "lg";
  magnetic?: boolean;
  /** Screen-reader suffix for external links. */
  externalLabel?: string;
  className?: string;
  children: string;
  icon?: ReactNode;
};

type LinkButtonProps = CommonProps & { href: string } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;
type PlainButtonProps = CommonProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className">;

const base =
  "btn group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-medium whitespace-nowrap select-none transition-[transform,background-color,border-color,color] duration-(--dur-ui) ease-(--ease-glide) active:scale-[0.97]";

const variants: Record<Variant, string> = {
  primary: "bg-(color:--tone-fg) text-(color:--tone-bg)",
  secondary:
    "border border-[color-mix(in_oklab,var(--tone-fg)_28%,transparent)] text-(color:--tone-fg) hover:border-(color:--tone-accent)",
  ghost: "text-(color:--tone-fg)",
};

const sizes = { md: "h-12 px-6 text-[0.95rem]", lg: "h-14 px-8 text-base" };

/**
 * The only button. Label rolls up on hover; the primary variant is magnetic on fine pointers.
 * Renders a link when `href` is given.
 */
export function Button(props: LinkButtonProps | PlainButtonProps) {
  const { variant = "primary", size = "md", magnetic, externalLabel, className, children, icon, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);
  const external = "href" in props && props.href ? isExternal(props.href) : false;
  const trailing = icon ?? (external ? <ArrowUpRight size={18} /> : <ArrowRight size={18} />);

  const label = (
    <>
      <span className="roll" data-label={children}>
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      <span className="transition-transform duration-(--dur-ui) ease-(--ease-glide) group-hover:translate-x-0.5">
        {trailing}
      </span>
    </>
  );

  const content =
    "href" in props && props.href !== undefined ? (
      <SmartLink
        href={props.href}
        externalLabel={externalLabel}
        className={classes}
        data-cursor="link"
      >
        {label}
      </SmartLink>
    ) : (
      <button
        type="button"
        className={classes}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {label}
      </button>
    );

  const isMagnetic = magnetic ?? variant === "primary";
  return isMagnetic ? <Magnetic>{content}</Magnetic> : content;
}
