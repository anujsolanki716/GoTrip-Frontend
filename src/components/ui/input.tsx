import * as React from "react";
import { cn } from "@/lib/utils";

export const fieldBase =
  "w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-gold focus:outline-none focus:ring-3 focus:ring-gold/25 disabled:opacity-60 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/15";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-24 py-3", className)} {...props} />;
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        fieldBase,
        "h-11 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%23737780%22><path d=%22M5.5 7.5 10 12l4.5-4.5%22 stroke=%22%23737780%22 stroke-width=%221.5%22 fill=%22none%22/></svg>')] bg-[length:1.1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
