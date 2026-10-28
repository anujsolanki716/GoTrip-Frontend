import { Link } from "react-router";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link to="/" className={cn("inline-flex shrink-0 items-center", className)} aria-label="GoTrip home">
      <img src={compact ? BRAND.logoMark : BRAND.logo} alt="GoTrip Self-Drive Car Rental" className={compact ? "h-9 w-9" : "h-10 w-auto sm:h-11"} />
    </Link>
  );
}
