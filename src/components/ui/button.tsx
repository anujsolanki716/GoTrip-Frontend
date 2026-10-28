import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        gold: "bg-gold text-ink shadow-[0_8px_24px_-8px_rgba(233,185,73,0.6)] hover:bg-gold-600 hover:-translate-y-0.5",
        dark: "bg-ink text-white hover:bg-ink-700",
        outline: "border border-line bg-white text-ink hover:border-ink/30 hover:bg-cloud",
        outlineLight: "border border-white/25 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:border-white/40",
        ghost: "text-ink hover:bg-cloud",
        whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebe5b]",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        link: "text-ink underline-offset-4 hover:underline px-0",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "gold", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
