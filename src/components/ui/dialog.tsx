import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export function DialogContent({
  className,
  children,
  side = "center",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { side?: "center" | "right" }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 bg-white shadow-2xl focus:outline-none data-[state=open]:animate-in",
          side === "center" &&
            "top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0",
          side === "right" && "inset-y-0 right-0 h-full w-[86%] max-w-sm data-[state=open]:slide-in-from-right",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute top-4 right-4 rounded-lg p-1.5 opacity-70 transition hover:bg-cloud hover:opacity-100"
          aria-label="Close"
        >
          <X className="size-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
