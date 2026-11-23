"use client";

import { useEffect, useRef, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { PRODUCTS, isProductId, type ProductId } from "@/content/site";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

// The selected tab lives in the URL hash (#data-engine, #evaluation, ...) so nav
// links can deep-link to a product. Other hashes (#research) keep the last choice.
const SELECT_EVENT = "scale:select-product";
const DEFAULT_ID: ProductId = PRODUCTS[0].id;
let lastSelected: ProductId = DEFAULT_ID;

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener(SELECT_EVENT, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener(SELECT_EVENT, onChange);
  };
}

function getSnapshot(): ProductId {
  const hash = window.location.hash.slice(1);
  if (isProductId(hash)) lastSelected = hash;
  return lastSelected;
}

function getServerSnapshot(): ProductId {
  return DEFAULT_ID;
}

function selectProduct(id: ProductId) {
  window.history.replaceState(window.history.state, "", `#${id}`);
  window.dispatchEvent(new Event(SELECT_EVENT));
}

export function ProductTabs({ mocks }: { mocks: Record<ProductId, ReactNode> }) {
  const selected = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const tablistRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // On narrow screens the tab row scrolls sideways; keep the selected tab in view.
  // Only the row scrolls horizontally, never the page.
  useEffect(() => {
    const list = tablistRef.current;
    const tab = document.getElementById(`tab-${selected}`);
    if (!list || !tab) return;
    const listRect = list.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    if (tabRect.left < listRect.left || tabRect.right > listRect.right) {
      const padding = parseFloat(getComputedStyle(list).paddingLeft) || 0;
      list.scrollBy({
        left: tabRect.left - listRect.left - padding,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
  }, [selected, reducedMotion]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = PRODUCTS.findIndex((product) => product.id === selected);
    const last = PRODUCTS.length - 1;
    let next: number;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;
    event.preventDefault();
    const id = PRODUCTS[next].id;
    selectProduct(id);
    document.getElementById(`tab-${id}`)?.focus();
  };

  return (
    <div>
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Products"
        onKeyDown={onKeyDown}
        className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] py-1 md:mx-0 md:px-0"
      >
        {PRODUCTS.map((product) => {
          const active = product.id === selected;
          return (
            <button
              key={product.id}
              id={`tab-${product.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${product.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => selectProduct(product.id)}
              className={cn(
                "h-11 shrink-0 rounded-full px-5 text-[15px] transition-colors",
                active ? "bg-ink text-white" : "bg-mist text-ink/70 hover:bg-fog hover:text-ink",
              )}
            >
              {product.shortName}
            </button>
          );
        })}
      </div>

      {PRODUCTS.map((product) => (
        <div
          key={product.id}
          id={`panel-${product.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${product.id}`}
          hidden={product.id !== selected}
          className="mt-10 grid animate-panel-in grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink/60">{product.name}</p>
            <h3 className="mt-4 text-balance text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.08] tracking-[-0.025em]">
              {product.headline}
            </h3>
            <p className="mt-5 text-[17px] leading-relaxed text-ink/65">{product.description}</p>
            <ul className="mt-8 space-y-3">
              {product.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-[15px]">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-white">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <ButtonLink href="/demo" size="sm" className="mt-9">
              Talk to our team
            </ButtonLink>
          </div>
          <div className="rounded-2xl bg-mist p-3 sm:p-6 lg:p-8">{mocks[product.id]}</div>
        </div>
      ))}
    </div>
  );
}
