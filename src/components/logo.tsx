import { cn } from "@/lib/cn";

/** Original mark for this concept build: three stacked layers. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <rect x="2" y="15" width="20" height="5" rx="1.5" />
      <rect x="2" y="9" width="14" height="4.5" rx="1.5" opacity="0.7" />
      <rect x="2" y="3.5" width="8" height="4" rx="1.5" opacity="0.45" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className="size-6" />
      <span className="text-[22px] font-semibold leading-none tracking-[-0.045em]">scale</span>
    </span>
  );
}
