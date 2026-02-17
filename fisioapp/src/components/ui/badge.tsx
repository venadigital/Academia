import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  neutral: "bg-[#f2ede4] text-[#5c4a2f]",
  teal: "bg-[var(--accent-soft)] text-[var(--accent-2)]",
  amber: "bg-[#fde8c2] text-[#8a5c14]",
  red: "bg-[#f5d1cf] text-[#8f3d3d]",
  green: "bg-[#d8f1e6] text-[#1e6b4f]",
};

export function Badge({
  variant = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
