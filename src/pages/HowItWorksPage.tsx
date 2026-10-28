import { Link } from "react-router";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { STEPS } from "./HomePage";

export function HowItWorksPage() {
  useDocumentTitle("How it works");
  return (
    <>
      <PageHero eyebrow="How it works" title="From enquiry to the open road">
        GoTrip's website helps you discover cars and reach our team. Every rental is arranged directly with us, offline.
      </PageHero>
      <div className="container-page py-14">
        <ol className="relative mx-auto max-w-3xl space-y-8 border-l-2 border-gold/40 pl-8">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative">
              <span className="absolute -left-[3.05rem] flex size-10 items-center justify-center rounded-full bg-ink text-gold ring-4 ring-white">
                <Icon className="size-5" aria-hidden />
              </span>
              <p className="text-xs font-bold text-gold-600">STEP {i + 1}</p>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-1 text-muted">{text}</p>
            </li>
          ))}
        </ol>
        <div className="mx-auto mt-14 max-w-3xl rounded-2xl bg-cloud p-6 text-sm leading-relaxed">
          <h2 className="text-lg font-semibold">Important</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink/80">
            <li>Sending an enquiry does not book or reserve a car.</li>
            <li>We never ask for card details or online payments on this website.</li>
            <li>The car is confirmed only after our team verifies your documents and you sign the rental agreement in person.</li>
            <li>Shown availability is indicative and may change.</li>
          </ul>
        </div>
        <div className="mt-10 text-center">
          <Button asChild size="lg"><Link to="/cars">Explore cars</Link></Button>
        </div>
      </div>
    </>
  );
}
