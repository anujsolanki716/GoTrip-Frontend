import { PageHero } from "@/components/layout/PageHero";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export function PrivacyPage() {
  useDocumentTitle("Privacy policy");
  const c = useSiteConfig();
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy policy" />
      <article className="container-page prose-gotrip max-w-3xl py-14">
        <p className="rounded-xl bg-cloud p-4 text-sm">Template text. Please have it reviewed by a legal adviser, including for India's Digital Personal Data Protection Act, 2023.</p>
        <h2>What we collect</h2>
        <p>When you send an enquiry we collect your name, mobile number, optional email, the car you're interested in, preferred dates and pickup area, and your message. We also keep basic technical data (a one-way hash of your IP address and your browser type) to prevent abuse.</p>
        <h2>Why we collect it</h2>
        <p>Only to respond to your enquiry, discuss a possible rental and keep records of our conversations. We do not sell your data.</p>
        <h2>What we don't collect</h2>
        <p>We do not collect payment card details, bank details or identity documents through this website.</p>
        <h2>How long we keep it</h2>
        <p>Enquiries are kept for as long as needed to serve you and meet legal obligations, then deleted or anonymised.</p>
        <h2>Your rights</h2>
        <p>You can ask us to access, correct or delete your data, or withdraw consent, by emailing <a href={`mailto:${c.email}`} className="underline">{c.email}</a>.</p>
      </article>
    </>
  );
}

export function TermsPage() {
  useDocumentTitle("Website terms");
  return (
    <>
      <PageHero eyebrow="Legal" title="Website terms of use" />
      <article className="container-page prose-gotrip max-w-3xl py-14">
        <p className="rounded-xl bg-cloud p-4 text-sm">Template text. Please have it reviewed by a legal adviser.</p>
        <h2>About this website</h2>
        <p>This website shows GoTrip's cars, indicative prices and policies, and lets you send enquiries. It does not take bookings, reservations or payments.</p>
        <h2>Enquiries are not bookings</h2>
        <p>Submitting an enquiry does not reserve a car or create a contract. A rental is only agreed when you and GoTrip sign a rental agreement offline after verification.</p>
        <h2>Prices and availability</h2>
        <p>Prices, specifications, photos and availability are indicative and may change without notice. Final terms are set out in your rental agreement.</p>
        <h2>Acceptable use</h2>
        <p>Please don't misuse the website, submit false information or try to disrupt the service.</p>
      </article>
    </>
  );
}
