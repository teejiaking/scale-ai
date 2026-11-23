import { cn } from "@/lib/cn";
import { SmartLink, type SmartLinkProps } from "./smart-link";

const VARIANTS = {
  primary: "bg-ink text-white hover:bg-ink/80",
  inverse: "bg-white text-ink hover:bg-white/85",
  outline: "border border-ink/15 text-ink hover:bg-ink/5",
  "outline-inverse": "border border-white/30 text-white hover:bg-white/10",
  soft: "bg-ink/6 text-ink hover:bg-ink/10",
} as const;

const SIZES = {
  sm: "h-10 px-4 text-[15px]",
  md: "h-12 px-6 text-base",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

export function buttonClasses({
  variant = "primary",
  size = "md",
}: { variant?: ButtonVariant; size?: ButtonSize } = {}): string {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: SmartLinkProps & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <SmartLink className={cn(buttonClasses({ variant, size }), className)} {...props} />;
}
