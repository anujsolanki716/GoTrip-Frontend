import { Info } from "lucide-react";
import { NOT_A_BOOKING } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function NotABookingNotice({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div
      role="note"
      className={cn("flex gap-3 rounded-xl border border-gold/40 bg-gold-100/60 p-4 text-sm text-ink/85", className)}
    >
      <Info className="mt-0.5 size-5 shrink-0 text-gold-600" aria-hidden />
      <p>
        <strong className="font-semibold text-ink">This is an enquiry, not a booking.</strong>{" "}
        {compact ? "No car is reserved and no payment is taken online." : NOT_A_BOOKING}
      </p>
    </div>
  );
}
