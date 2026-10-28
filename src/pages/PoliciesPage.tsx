import { Link } from "react-router";
import { PageHero } from "@/components/layout/PageHero";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const SECTIONS = [
  { id: "eligibility", title: "Eligibility" },
  { id: "documents", title: "Documents required" },
  { id: "pricing", title: "Pricing, deposit & payment" },
  { id: "usage", title: "Kilometres, fuel & tolls" },
  { id: "return", title: "Pickup, return & late return" },
  { id: "damage", title: "Damage, insurance & accidents" },
  { id: "prohibited", title: "Prohibited use" },
  { id: "changes", title: "Changing or cancelling plans" },
];

export function PoliciesPage() {
  useDocumentTitle("Rental policies", "GoTrip self-drive rental policies: eligibility, documents, deposit, km limits, fuel and usage rules.");
  return (
    <>
      <PageHero eyebrow="Rental policies" title="Clear terms, no surprises">
        A summary of how GoTrip rentals work. The signed rental agreement you receive offline is the final, binding document.
      </PageHero>
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[240px_1fr]">
        <nav aria-label="On this page" className="hidden lg:block">
          <ul className="sticky top-28 space-y-2 text-sm">
            {SECTIONS.map((s) => <li key={s.id}><a href={`#${s.id}`} className="text-muted hover:text-ink">{s.title}</a></li>)}
          </ul>
        </nav>
        <article className="prose-gotrip max-w-3xl">
          <p className="rounded-xl bg-gold-100/60 p-4 text-sm">
            These policies are indicative and may be updated. Exact terms for your rental are confirmed by our team and set out in the rental agreement.
          </p>
          <h2 id="eligibility">Eligibility</h2>
          <ul>
            <li>Minimum age 21 years (some premium cars and SUVs may require 23+).</li>
            <li>A valid Indian driving licence for light motor vehicles (LMV), held for at least 1 year. International licences are considered case by case.</li>
            <li><strong>College students:</strong> eligible students may rent subject to age, licence and document verification, including a valid college ID. Our team may ask for additional verification.</li>
            <li><strong>Corporate employees & professionals:</strong> a company ID or recent proof of employment may be requested.</li>
            <li>GoTrip may decline any rental at its discretion after verification.</li>
          </ul>
          <h2 id="documents">Documents required</h2>
          <p>Originals are verified in person at handover. Please do not upload or send identity documents through the website enquiry form.</p>
          <ul>
            <li>Driving licence (original).</li>
            <li>Government photo ID with address: Aadhaar, passport or voter ID.</li>
            <li>Students: college ID card. Professionals: company ID (if requested).</li>
            <li>Local address proof if your ID address is outside the NCR (if requested).</li>
          </ul>
          <h2 id="pricing">Pricing, deposit & payment</h2>
          <ul>
            <li>Prices on the website are <strong>indicative</strong> and may vary by date, duration and demand. The final price is confirmed by our team before the rental.</li>
            <li>A refundable security deposit applies. It is collected offline at handover and refunded after the car is returned and checked, less any agreed deductions.</li>
            <li>All payments are made offline through GoTrip's approved process. <strong>GoTrip never collects payments on this website</strong> and will never ask for card details or OTPs.</li>
          </ul>
          <h2 id="usage">Kilometres, fuel & tolls</h2>
          <ul>
            <li>Each car includes a daily km allowance (shown on the car page). Extra km are charged at the listed rate.</li>
            <li>Fuel policy is same-to-same unless stated: return the car with the same fuel or charge level.</li>
            <li>Tolls, FASTag recharges, parking, interstate permits and traffic challans during the rental are the renter's responsibility.</li>
          </ul>
          <h2 id="return">Pickup, return & late return</h2>
          <ul>
            <li>Pickup and drop are from our Greater Noida location or an agreed point in our service areas. Doorstep delivery may be available at an extra charge.</li>
            <li>The car is inspected together with you at pickup and return, with photos.</li>
            <li>Please inform us in advance if you will be late. Late returns may be charged per hour, as stated in the rental agreement.</li>
          </ul>
          <h2 id="damage">Damage, insurance & accidents</h2>
          <ul>
            <li>Cars are insured. In case of damage, the renter may be liable up to the amount stated in the rental agreement, plus any loss of use.</li>
            <li>In case of an accident or breakdown, stop safely, call us immediately and do not arrange repairs yourself.</li>
            <li>Damage caused by negligence, prohibited use or driving under the influence is not covered.</li>
          </ul>
          <h2 id="prohibited">Prohibited use</h2>
          <ul>
            <li>Driving under the influence of alcohol or drugs.</li>
            <li>Letting anyone not named on the agreement drive the car.</li>
            <li>Commercial use, carrying passengers for hire, sub-letting, racing, rallies or towing.</li>
            <li>Off-road driving, unless agreed in writing.</li>
            <li>Smoking in the car, or carrying illegal or hazardous goods.</li>
            <li>Leaving the agreed states or regions without our written consent.</li>
          </ul>
          <h2 id="changes">Changing or cancelling plans</h2>
          <p>
            Because the website only takes enquiries, there is nothing to cancel online. If your plans change after you have
            agreed a rental with our team, please contact us as early as possible. Any charges are set out in your rental agreement.
          </p>
          <p className="mt-8">Questions? <Link to="/contact" className="font-semibold underline">Contact our team</Link>.</p>
        </article>
      </div>
    </>
  );
}
