import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", {
  variants: {
    tone: {
      neutral: "bg-cloud text-ink/80",
      gold: "bg-gold-100 text-[#7a5a10]",
      dark: "bg-ink text-white",
      green: "bg-emerald-50 text-emerald-700",
      amber: "bg-amber-50 text-amber-700",
      red: "bg-red-50 text-red-700",
      blue: "bg-sky-50 text-sky-700",
      violet: "bg-violet-50 text-violet-700",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export function Badge({
  className,
  tone,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
