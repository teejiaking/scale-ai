import Link from "next/link";
import type { ComponentProps } from "react";

export type SmartLinkProps = Omit<ComponentProps<"a">, "href"> & { href: string };

/**
 * Picks the right element for a link:
 * - external URLs open in a new tab,
 * - hash links use a plain anchor so the browser fires `hashchange` and
 *   scrolls natively (the product tabs listen for it),
 * - everything else uses client-side navigation.
 */
export function SmartLink({ href, ...props }: SmartLinkProps) {
  if (/^https?:\/\//.test(href)) {
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
  }
  if (href.includes("#")) {
    return <a href={href} {...props} />;
  }
  return <Link href={href} {...props} />;
}
