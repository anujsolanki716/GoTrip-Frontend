import { Badge } from "@/components/ui/badge";
import { label } from "@/lib/format";
import type { CarStatus } from "@/lib/types";

const TONES = { available: "green", on_request: "amber", under_maintenance: "neutral", unavailable: "red" } as const;

export function StatusBadge({ status }: { status: CarStatus }) {
  return (
    <Badge tone={TONES[status]} title="Indicative only. Availability is confirmed by our team.">
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {label(status)}
    </Badge>
  );
}
