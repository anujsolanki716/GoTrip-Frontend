import { Clock, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { EnquirySuccess } from "@/components/enquiry/EnquirySuccess";
import { PageHero } from "@/components/layout/PageHero";
import { WhatsAppIcon } from "@/components/layout/WhatsAppButton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { api } from "@/lib/api";
import { telLink, waLink } from "@/lib/format";
import type { EnquiryReceipt } from "@/lib/types";

export function EnquirePage() {
  useDocumentTitle("Send an enquiry", "Enquire about a GoTrip self-drive car. Free, no account needed, and not a booking.");
  const c = useSiteConfig();
  const [params] = useSearchParams();
  const slug = params.get("car") ?? undefined;
  const car = useQuery({ queryKey: ["car", slug], queryFn: () => api.car(slug!), enabled: !!slug, retry: false });
  const [receipt, setReceipt] = useState<EnquiryReceipt | null>(null);

  return (
    <>
      <PageHero eyebrow="Enquire" title="Tell us about your trip">
        Share a few details and our team will get back to you about availability, eligibility and pricing. No account and no payment needed.
      </PageHero>
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_340px]">
        <div className="rounded-2xl border border-line p-5 shadow-sm sm:p-8">
          {receipt ? (
            <EnquirySuccess receipt={receipt} carName={car.data?.name} />
          ) : (
            <EnquiryForm key={car.data?.slug ?? "general"} carSlug={car.data?.slug} carName={car.data?.name} source="enquiry_page" onSuccess={setReceipt} />
          )}
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl bg-ink p-6 text-white">
            <h2 className="text-lg font-semibold">Prefer to talk?</h2>
            <p className="mt-1 text-sm text-white/65">Reach our Greater Noida team directly.</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li><a className="flex items-center gap-3 hover:text-gold" href={waLink(c.whatsapp, "Hi GoTrip, I'd like to enquire about a car.")} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="size-5 text-[#25D366]" /> WhatsApp chat</a></li>
              <li><a className="flex items-center gap-3 hover:text-gold" href={telLink(c.phone)}><Phone className="size-5 text-gold" aria-hidden /> {c.phone}</a></li>
              <li><a className="flex items-center gap-3 hover:text-gold" href={`mailto:${c.email}`}><Mail className="size-5 text-gold" aria-hidden /> {c.email}</a></li>
              <li className="flex items-center gap-3 text-white/70"><Clock className="size-5 text-gold" aria-hidden /> {c.hours}</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-cloud p-6 text-sm">
            <h2 className="font-semibold">What happens next?</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-ink/80">
              <li>We review your enquiry and call or message you.</li>
              <li>We confirm availability, eligibility and the final price.</li>
              <li>Documents, the rental agreement and payment are completed offline.</li>
              <li>You pick up the car and drive.</li>
            </ol>
          </div>
        </aside>
      </div>
    </>
  );
}
