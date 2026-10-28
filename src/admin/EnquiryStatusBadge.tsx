import { Badge } from "@/components/ui/badge";
import { label } from "@/lib/format";
import type { EnquiryStatus } from "@/lib/types";

const TONES = {
  new: "gold",
  contacted: "blue",
  in_discussion: "violet",
  converted_offline: "green",
  not_converted: "neutral",
  spam: "red",
} as const;

export function EnquiryStatusBadge({ status }: { status: EnquiryStatus }) {
  return <Badge tone={TONES[status]}>{label(status)}</Badge>;
}

export const ENQUIRY_STATUSES: EnquiryStatus[] = ["new", "contacted", "in_discussion", "converted_offline", "not_converted", "spam"];
