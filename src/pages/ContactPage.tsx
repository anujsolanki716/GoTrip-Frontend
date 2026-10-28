import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";
import { PageHero } from "@/components/layout/PageHero";
import { WhatsAppIcon } from "@/components/layout/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { telLink, waLink } from "@/lib/format";

export function ContactPage() {
  useDocumentTitle("Contact GoTrip");
  const c = useSiteConfig();
  const cards = [
    { icon: <WhatsAppIcon className="size-6 text-[#25D366]" />, title: "WhatsApp", value: "Chat with our team", href: waLink(c.whatsapp, "Hi GoTrip!"), external: true },
    { icon: <Phone className="size-6 text-gold-600" aria-hidden />, title: "Call", value: c.phone, href: telLink(c.phone) },
    { icon: <Mail className="size-6 text-gold-600" aria-hidden />, title: "Email", value: c.email, href: `mailto:${c.email}` },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="We're here to help">Questions about cars, eligibility or pricing? Get in touch.</PageHero>
      <div className="container-page py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <a key={card.title} href={card.href} {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="rounded-2xl border border-line p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
              {card.icon}
              <h2 className="mt-4 font-semibold">{card.title}</h2>
              <p className="mt-1 text-sm break-all text-muted">{card.value}</p>
            </a>
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-cloud p-6">
            <h2 className="flex items-center gap-2 font-semibold"><MapPin className="size-5 text-gold-600" aria-hidden /> Location</h2>
            <p className="mt-2 text-sm text-ink/80">{c.address}</p>
            <h2 className="mt-6 flex items-center gap-2 font-semibold"><Clock className="size-5 text-gold-600" aria-hidden /> Hours</h2>
            <p className="mt-2 text-sm text-ink/80">{c.hours}</p>
            <h2 className="mt-6 font-semibold">Service areas</h2>
            <p className="mt-2 text-sm text-ink/80">{c.service_areas.join(" · ")}</p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-ink p-8 text-white">
            <h2 className="text-2xl font-bold">Have a car in mind?</h2>
            <p className="mt-2 text-white/70">Send us an enquiry and we'll get back to you. It's free and it isn't a booking.</p>
            <div className="mt-6"><Button asChild><Link to="/enquire">Send an enquiry</Link></Button></div>
          </div>
        </div>
      </div>
    </>
  );
}
