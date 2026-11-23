import Link from "next/link";
import { FOOTER_COLUMNS } from "@/content/site";
import { Logo } from "./logo";
import { SmartLink } from "./smart-link";

export function SiteFooter() {
  return (
    <footer id="site-footer" data-header-theme="dark" className="bg-black text-white">
      <div className="site-container py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)] lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Scale home" className="inline-block rounded-md">
              <Logo />
            </Link>
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/55">
              Data, evaluation, and agents for AI that holds up in the real world.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-white/55">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <SmartLink
                      href={link.href}
                      className="text-[15px] text-white/75 transition-colors hover:text-white"
                    >
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            Concept build for demonstration only. Not affiliated with or endorsed by Scale AI, Inc.
            Customer stories and product data shown here are illustrative.
          </p>
          <SmartLink
            href="https://scale.com"
            className="shrink-0 text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Visit the official site
            <span className="sr-only"> (opens in a new tab)</span>
          </SmartLink>
        </div>
      </div>
    </footer>
  );
}
