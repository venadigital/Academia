import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variants = {
  primary:
    "bg-[var(--accent)] text-white shadow-[0_12px_30px_rgba(31,122,118,0.28)] hover:bg-[var(--accent-2)]",
  ghost:
    "border border-[var(--line)] bg-white/80 text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
  subtle:
    "bg-[var(--accent-soft)] text-[var(--accent-2)] hover:bg-[var(--accent)] hover:text-white",
  danger: "bg-[#8f3d3d] text-white hover:bg-[#7a3232]",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
