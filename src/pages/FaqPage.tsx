import { ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { PageHero } from "@/components/layout/PageHero";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export const FAQS = [
  { q: "Can I book a car on the website?", a: "No. The website lets you explore cars and send an enquiry. Our team then contacts you to confirm availability, eligibility and pricing. The rental is arranged offline." },
  { q: "Do I need to pay anything online?", a: "No. GoTrip never takes payments on this website and will never ask for card details or OTPs. Any payment is made offline through our approved process after you agree the rental with our team." },
  { q: "Do I need an account to enquire?", a: "No account is needed. Just share your name, mobile number and a few trip details." },
  { q: "Can college students rent a car?", a: "Yes, eligible students can. You'll need to meet the minimum age, hold a valid driving licence for at least a year and provide a valid college ID along with other documents. Our team verifies eligibility in person." },
  { q: "What documents do I need?", a: "Your original driving licence, a government photo ID with address (such as Aadhaar or passport) and, for students, a college ID. See the rental policies for details." },
  { q: "Is there a security deposit?", a: "Yes, a refundable security deposit applies. The amount depends on the car and is collected offline at handover." },
  { q: "Is fuel included?", a: "Cars follow a same-to-same fuel policy unless stated. Return the car with the same fuel or charge level you received it with." },
  { q: "Is there a kilometre limit?", a: "Each car has a daily km allowance shown on its page. Extra km are charged at the listed rate." },
  { q: "Do you deliver the car?", a: "Pickup is from our Greater Noida location. Delivery within our service areas may be possible at an extra charge. Ask our team." },
  { q: "Does 'Available' mean the car is reserved for me?", a: "No. Availability shown on the website is indicative only. A car is confirmed only when our team agrees the rental with you offline." },
];

export function FaqPage() {
  useDocumentTitle("Frequently asked questions");
  return (
    <>
      <PageHero eyebrow="FAQ" title="Frequently asked questions" />
      <div className="container-page max-w-3xl py-14">
        <div className="divide-y divide-line rounded-2xl border border-line">
          {FAQS.map((f) => (
            <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {f.q}
                <ChevronDown className="size-5 shrink-0 text-muted transition group-open:rotate-180" aria-hidden />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted">Still have questions? <Link to="/contact" className="font-semibold text-ink underline">Contact us</Link>.</p>
      </div>
    </>
  );
}
