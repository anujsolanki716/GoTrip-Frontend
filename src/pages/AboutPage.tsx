import { Link } from "react-router";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { BRAND } from "@/lib/brand";

export function AboutPage() {
  useDocumentTitle("About GoTrip");
  return (
    <>
      <PageHero eyebrow="About us" title={`${BRAND.tagline}`}>
        GoTrip is a self-drive car rental business based in Greater Noida, Uttar Pradesh.
      </PageHero>
      <div className="container-page prose-gotrip max-w-3xl py-14">
        <p>
          We started GoTrip to make self-drive cars simple and trustworthy for the people of Greater Noida: students at the
          city's colleges and universities, professionals working across Noida and NCR, and families who want the freedom to
          travel on their own schedule.
        </p>
        <h2>What we believe in</h2>
        <ul>
          <li><strong>Honesty first.</strong> Indicative prices, km limits and deposits are shown upfront, and confirmed with you before any rental.</li>
          <li><strong>Human support.</strong> You talk to our local team, not a chatbot, on WhatsApp or phone.</li>
          <li><strong>Safe, clean cars.</strong> Every car is serviced on schedule and cleaned before each handover.</li>
          <li><strong>Responsible renting.</strong> We verify documents and eligibility in person to keep our customers and community safe.</li>
        </ul>
        <h2>Where we operate</h2>
        <p>We are based in Greater Noida and serve selected areas of Noida and Delhi NCR. Ask our team about pickup and delivery options.</p>
        <div className="mt-10"><Button asChild size="lg"><Link to="/cars">See our cars</Link></Button></div>
      </div>
    </>
  );
}
