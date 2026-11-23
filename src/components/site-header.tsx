"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FocusEvent, type RefObject } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { NAV_GROUPS, type NavGroup } from "@/content/site";
import { cn } from "@/lib/cn";
import { buttonClasses } from "./button";
import { Logo } from "./logo";
import { SmartLink } from "./smart-link";

type Theme = "light" | "dark";

/**
 * Reports whether the content under the header is light or dark, based on the
 * nearest `data-header-theme` ancestor of whatever sits beneath its midpoint.
 */
function useThemeUnderHeader(headerRef: RefObject<HTMLElement | null>): Theme {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const header = headerRef.current;
      if (!header) return;
      let next: Theme = "light";
      const stack = document.elementsFromPoint(window.innerWidth / 2, header.offsetHeight / 2);
      for (const el of stack) {
        if (header.contains(el)) continue;
        const host = el.closest<HTMLElement>("[data-header-theme]");
        if (host?.dataset.headerTheme === "dark") next = "dark";
        break;
      }
      setTheme(next);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Route changes swap page content without necessarily scrolling.
    const bodyObserver = new ResizeObserver(schedule);
    bodyObserver.observe(document.body);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      bodyObserver.disconnect();
    };
  }, [headerRef]);

  return theme;
}

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTheme = useThemeUnderHeader(headerRef);
  const dark = !mobileOpen && pageTheme === "dark";

  useEffect(() => {
    if (!mobileOpen) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    // Make the page behind the menu unreachable for keyboard and screen readers.
    const background = [document.getElementById("main"), document.getElementById("site-footer")];
    background.forEach((el) => el?.setAttribute("inert", ""));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onBreakpoint = () => {
      if (desktop.matches) setMobileOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);

    return () => {
      root.style.overflow = previousOverflow;
      background.forEach((el) => el?.removeAttribute("inert"));
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-[var(--header-h)] backdrop-blur-md transition-colors duration-300",
          dark ? "bg-black/85 text-white" : "bg-white/90 text-ink",
        )}
      >
        <div className="flex h-full items-center gap-6 px-5 md:px-6">
          <Link href="/" aria-label="Scale home" className="shrink-0 rounded-md" onClick={closeMobile}>
            <Logo />
          </Link>

          <DesktopNav dark={dark} />

          <div className="ml-auto flex items-center gap-2">
            <SmartLink
              href="/demo"
              onClick={closeMobile}
              className={cn(
                buttonClasses({ variant: dark ? "inverse" : "primary", size: "sm" }),
                // A variant (not plain `hidden`) so it reliably overrides the button's inline-flex.
                "max-sm:hidden",
              )}
            >
              Book a demo
            </SmartLink>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((open) => !open)}
              className={cn(
                "grid size-10 place-items-center rounded-lg transition-colors lg:hidden",
                dark ? "hover:bg-white/10" : "hover:bg-ink/5",
              )}
            >
              {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {/* Rendered outside <header>: its backdrop-filter would otherwise become the
          containing block for this fixed panel and collapse it to the header's height. */}
      <MobileMenu open={mobileOpen} onNavigate={closeMobile} />
    </>
  );
}

function DesktopNav({ dark }: { dark: boolean }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const openedAt = useRef(0);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!openId) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenId(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenId(null);
        document.getElementById(`nav-trigger-${openId}`)?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openId]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const cancelClose = () => window.clearTimeout(closeTimer.current);

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenId(null), 160);
  };

  // `timeStamp` comes from the triggering DOM event (same clock as performance.now()).
  const openMenu = (id: string, timeStamp: number) => {
    cancelClose();
    if (openId !== id) {
      openedAt.current = timeStamp;
      setOpenId(id);
    }
  };

  const onTriggerClick = (id: string, timeStamp: number) => {
    // A click right after hover-open should keep the menu open, not toggle it shut.
    if (openId === id && timeStamp - openedAt.current > 350) setOpenId(null);
    else openMenu(id, timeStamp);
  };

  const onGroupBlur = (event: FocusEvent<HTMLLIElement>, id: string) => {
    const next = event.relatedTarget as Node | null;
    if (!next || event.currentTarget.contains(next)) return;
    setOpenId((current) => (current === id ? null : current));
  };

  return (
    <nav ref={navRef} aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {NAV_GROUPS.map((group) => (
          <DesktopNavGroup
            key={group.id}
            group={group}
            dark={dark}
            open={openId === group.id}
            onPointerEnterTrigger={(timeStamp) => openMenu(group.id, timeStamp)}
            onTriggerClick={(timeStamp) => onTriggerClick(group.id, timeStamp)}
            onPointerEnterGroup={cancelClose}
            onPointerLeaveGroup={scheduleClose}
            onBlur={(event) => onGroupBlur(event, group.id)}
            onNavigate={() => setOpenId(null)}
          />
        ))}
      </ul>
    </nav>
  );
}

function DesktopNavGroup({
  group,
  dark,
  open,
  onPointerEnterTrigger,
  onTriggerClick,
  onPointerEnterGroup,
  onPointerLeaveGroup,
  onBlur,
  onNavigate,
}: {
  group: NavGroup;
  dark: boolean;
  open: boolean;
  onPointerEnterTrigger: (timeStamp: number) => void;
  onTriggerClick: (timeStamp: number) => void;
  onPointerEnterGroup: () => void;
  onPointerLeaveGroup: () => void;
  onBlur: (event: FocusEvent<HTMLLIElement>) => void;
  onNavigate: () => void;
}) {
  return (
    <li
      className="relative"
      onPointerEnter={onPointerEnterGroup}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") onPointerLeaveGroup();
      }}
      onBlur={onBlur}
    >
      <button
        id={`nav-trigger-${group.id}`}
        type="button"
        aria-expanded={open}
        aria-controls={`nav-panel-${group.id}`}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") onPointerEnterTrigger(event.timeStamp);
        }}
        onClick={(event) => onTriggerClick(event.timeStamp)}
        className={cn(
          "inline-flex h-10 items-center gap-1 rounded-lg px-3 text-[15px] transition-colors",
          dark ? "hover:bg-white/10" : "hover:bg-ink/5",
          open && (dark ? "bg-white/10" : "bg-ink/5"),
        )}
      >
        {group.label}
        <ChevronDown
          aria-hidden
          className={cn("size-4 opacity-60 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <div id={`nav-panel-${group.id}`} hidden={!open} className="absolute left-0 top-full pt-2">
        <div className="w-[22rem] animate-menu-in rounded-2xl border border-ink/10 bg-white p-2 text-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]">
          <ul>
            {group.links.map((link) => (
              <li key={link.href}>
                <SmartLink
                  href={link.href}
                  onClick={onNavigate}
                  className="flex flex-col gap-0.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-mist"
                >
                  <span className="text-[15px] font-medium">{link.label}</span>
                  {link.description && <span className="text-sm text-ink/55">{link.description}</span>}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

function MobileMenu({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  return (
    <div
      id="mobile-menu"
      hidden={!open}
      className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto overscroll-contain border-t border-ink/10 bg-white text-ink lg:hidden"
    >
      <nav aria-label="Mobile" className="site-container py-4">
        <ul className="divide-y divide-ink/10">
          {NAV_GROUPS.map((group) => (
            <li key={group.id}>
              <details className="group">
                <summary className="flex list-none items-center justify-between py-4 text-lg [&::-webkit-details-marker]:hidden">
                  {group.label}
                  <ChevronDown
                    aria-hidden
                    className="size-5 opacity-60 transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <ul className="pb-4">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <SmartLink
                        href={link.href}
                        onClick={onNavigate}
                        className="block rounded-lg px-2 py-2.5 text-[15px] text-ink/75 transition-colors hover:bg-mist hover:text-ink"
                      >
                        {link.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>
        <SmartLink
          href="/demo"
          onClick={onNavigate}
          className={cn(buttonClasses({ variant: "primary", size: "md" }), "mt-6 w-full")}
        >
          Book a demo
        </SmartLink>
      </nav>
    </div>
  );
}
