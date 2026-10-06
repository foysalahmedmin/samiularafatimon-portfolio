import { clsx, type ClassValue } from "clsx";

/** Join class names, skipping falsy values. */
export const cn = (...values: ClassValue[]) => clsx(values);
