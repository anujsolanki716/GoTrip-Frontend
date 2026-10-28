import { CheckCircle2, Phone } from "lucide-react";
import { Link } from "react-router";
import { WhatsAppIcon } from "@/components/layout/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { telLink, waLink } from "@/lib/format";
import type { EnquiryReceipt } from "@/lib/types";

export function EnquirySuccess({ receipt, carName }: { receipt: EnquiryReceipt; carName?: string }) {
  const c = useSiteConfig();
  const text = `Hi GoTrip, I just sent enquiry ${receipt.reference}${carName ? ` for the ${carName}` : ""}.`;
  return (
    <div className="text-center" role="status" aria-live="polite">
      <CheckCircle2 className="mx-auto size-14 text-emerald-500" aria-hidden />
      <h2 className="mt-4 text-2xl font-bold">Enquiry received</h2>
      <p className="mt-2 text-muted">Your reference number is</p>
      <p className="mt-1 font-display text-2xl font-bold tracking-wider">
        {receipt.reference}
      </p>
      <div className="mx-auto mt-6 max-w-md rounded-xl border border-gold/40 bg-gold-100/60 p-4 text-left text-sm">
        <p className="font-semibold">This is not a booking.</p>
        <p className="mt-1 text-ink/80">
          No car has been reserved and no payment has been taken. Our team will
          contact you to discuss availability, eligibility, pricing and rental
          terms. The rental agreement, document verification, payment and
          handover are completed offline with our team.
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <Button asChild variant="whatsapp" className="w-full">
          <a
            href={waLink(c.whatsapp, text)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon className="size-4" /> Continue on WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <a href={telLink(c.phone)}>
            <Phone aria-hidden /> Call {c.phone}
          </a>
        </Button>
      </div>
      <Link
        to="/cars"
        className="mt-6 inline-block text-sm font-medium underline-offset-4 hover:underline"
      >
        Keep browsing cars
      </Link>
    </div>
  );
}
