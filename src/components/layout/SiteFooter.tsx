import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { BRAND } from "@/lib/brand";
import { telLink, waLink } from "@/lib/format";
import { Logo } from "./Logo";

export function SiteFooter() {
  const c = useSiteConfig();
  return (
    <footer className="bg-ink text-white/70">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="font-display text-lg text-gold">{BRAND.tagline}</p>
          <p className="text-sm leading-relaxed">
            Self-drive car rental for students, professionals and families in {BRAND.location}.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">Explore</h2>
          <ul className="space-y-2.5 text-sm">
            <li><Link className="hover:text-gold" to="/admin">Admin</Link></li>
            <li><Link className="hover:text-gold" to="/cars">All cars</Link></li>
            <li><Link className="hover:text-gold" to="/how-it-works">How it works</Link></li>
            <li><Link className="hover:text-gold" to="/policies">Rental policies</Link></li>
            <li><Link className="hover:text-gold" to="/faq">FAQ</Link></li>
            <li><Link className="hover:text-gold" to="/enquire">Send an enquiry</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">Service areas</h2>
          <ul className="space-y-2.5 text-sm">
            {c.service_areas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">Contact</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2.5"><Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden /><a className="hover:text-gold" href={telLink(c.phone)}>{c.phone}</a></li>
            <li className="flex gap-2.5"><svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 fill-gold" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg><a className="hover:text-gold" href={waLink(c.whatsapp, "Hi GoTrip, I have a question about renting a car.")} target="_blank" rel="noopener noreferrer">WhatsApp us</a></li>
            <li className="flex gap-2.5"><Mail className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden /><a className="hover:text-gold" href={`mailto:${c.email}`}>{c.email}</a></li>
            <li className="flex gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />{c.address}</li>
            <li className="flex gap-2.5"><Clock className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />{c.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GoTrip. All rights reserved. Prices shown are indicative. Enquiries are not bookings.</p>
          <div className="flex gap-4">
            <Link className="hover:text-gold" to="/privacy">Privacy</Link>
            <Link className="hover:text-gold" to="/terms">Website terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
