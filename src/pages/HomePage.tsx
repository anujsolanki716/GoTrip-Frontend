import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CarFront,
  ClipboardCheck,
  GraduationCap,
  Handshake,
  Home,
  KeyRound,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { CarCard } from "@/components/cars/CarCard";
import { CarGridSkeleton } from "@/components/cars/CarGridSkeleton";
import { WhatsAppIcon } from "@/components/layout/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { api } from "@/lib/api";
import { BRAND } from "@/lib/brand";
import { LABELS, telLink, waLink } from "@/lib/format";

const AUDIENCES = [
  { icon: GraduationCap, title: "College students", text: "Eligible students can explore budget-friendly hatchbacks and CNG cars for weekend plans and trips home. Eligibility is checked by our team." },
  { icon: Briefcase, title: "Corporate & professionals", text: "Comfortable sedans and SUVs for client visits, airport runs and work travel across Noida and NCR." },
  { icon: Home, title: "Residents & families", text: "7-seaters and SUVs for family functions, outstation drives and weekend getaways." },
];

export const STEPS = [
  { icon: Search, title: "Explore cars", text: "Browse our fleet, specifications and indicative prices." },
  { icon: MessageCircle, title: "Send an enquiry", text: "Tell us the car and dates. No account, no payment." },
  { icon: Phone, title: "Talk to our team", text: "We confirm availability, eligibility, pricing and terms with you." },
  { icon: ClipboardCheck, title: "Offline paperwork", text: "Document verification, rental agreement and payment happen offline." },
  { icon: KeyRound, title: "Pick up & drive", text: "Collect your sanitised car and enjoy the drive." },
];

const WHY = [
  { icon: ShieldCheck, title: "Well-maintained cars", text: "Regularly serviced and cleaned before every handover." },
  { icon: BadgeCheck, title: "Transparent terms", text: "Indicative pricing, km limits and deposits shown upfront." },
  { icon: Handshake, title: "Real people, real help", text: "Talk directly to our local team on WhatsApp or phone." },
  { icon: Sparkles, title: "Flexible plans", text: "Daily and weekly options discussed to fit your trip." },
];

export function HomePage() {
  useDocumentTitle("");
  const config = useSiteConfig();
  const navigate = useNavigate();
  const featured = useQuery({ queryKey: ["cars", "featured"], queryFn: () => api.cars({ featured: true, page_size: 6 }) });

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <img src={BRAND.heroImage} alt="" aria-hidden className="absolute inset-0 -z-10 h-full w-full object-cover opacity-90" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
        <div className="container-page grid min-h-[78vh] items-center py-16 sm:py-24">
          <div className="max-w-2xl animate-fade-up">
            <p className="eyebrow flex items-center gap-2"><MapPin className="size-4" aria-hidden />{BRAND.location}</p>
            <h1 className="mt-4 text-4xl leading-[1.08] font-extrabold sm:text-6xl">
              Self-drive cars,
              <br />
              <span className="text-gold">{BRAND.tagline}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/75">
              Explore well-maintained hatchbacks, sedans, SUVs and 7-seaters in Greater Noida. Send an enquiry or message us,
              and our team will help you plan the rest.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/cars">Explore cars <ArrowRight aria-hidden /></Link>
              </Button>
              <Button asChild size="lg" variant="outlineLight">
                <a href={waLink(config.whatsapp, "Hi GoTrip, I'd like to enquire about a self-drive car.")} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="size-4" /> WhatsApp us
                </a>
              </Button>
            </div>
            <p className="mt-6 text-sm text-white/55">Enquiries are free and are not bookings. No online payment.</p>
          </div>
        </div>

        {/* Quick search */}
        <div className="container-page relative pb-10">
          <form
            className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:grid-cols-[1fr_1fr_1fr_auto]"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const params = new URLSearchParams();
              for (const key of ["category", "transmission", "fuel_type"]) {
                const v = fd.get(key);
                if (v) params.set(key, String(v));
              }
              navigate(`/cars?${params}`);
            }}
            aria-label="Quick car search"
          >
            {[
              { name: "category", label: "Car type", options: ["hatchback", "sedan", "compact_suv", "suv", "muv"] },
              { name: "transmission", label: "Transmission", options: ["manual", "automatic"] },
              { name: "fuel_type", label: "Fuel", options: ["petrol", "diesel", "cng", "electric"] },
            ].map((f) => (
              <label key={f.name} className="flex flex-col gap-1">
                <span className="text-xs font-medium text-white/60">{f.label}</span>
                <Select name={f.name} defaultValue="" className="border-white/10 bg-ink/60 text-white">
                  <option value="">Any</option>
                  {f.options.map((o) => <option key={o} value={o}>{LABELS[o]}</option>)}
                </Select>
              </label>
            ))}
            <Button type="submit" size="lg" className="self-end"><Search aria-hidden /> Find cars</Button>
          </form>
        </div>
      </section>

      {/* AUDIENCES */}
      <section className="bg-cloud py-16 sm:py-24">
        <div className="container-page">
          <p className="eyebrow">Made for Greater Noida</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-bold sm:text-4xl">Whoever you are, there's a GoTrip car for your plans</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {AUDIENCES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-ink text-gold"><Icon aria-hidden /></span>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-16 sm:py-24">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Our fleet</p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Popular cars</h2>
            </div>
            <Button asChild variant="outline"><Link to="/cars">View all cars <ArrowRight aria-hidden /></Link></Button>
          </div>
          <div className="mt-10">
            {featured.isLoading ? (
              <CarGridSkeleton count={3} />
            ) : featured.data && featured.data.items.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.data.items.map((car) => <CarCard key={car.id} car={car} />)}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
                <CarFront className="mx-auto mb-3 size-8" aria-hidden />
                Our fleet is being updated. Please <Link className="font-semibold text-ink underline" to="/contact">contact us</Link> for current availability.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-ink py-16 text-white sm:py-24">
        <div className="container-page">
          <p className="eyebrow">Simple & transparent</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">How renting with GoTrip works</h2>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <span className="font-display text-sm font-bold text-gold">0{i + 1}</span>
                <Icon className="mt-3 size-7 text-gold" aria-hidden />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-white/60">{text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-white/55">
            GoTrip does not take bookings or payments on this website. Every rental is confirmed directly with our team.
          </p>
        </div>
      </section>

      {/* WHY */}
      <section className="py-16 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Why GoTrip</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Drive on your own terms, with a local team behind you</h2>
            <p className="mt-4 text-muted">
              We're a Greater Noida business serving {config.service_areas.slice(0, 3).join(", ")} and nearby NCR areas.
              Talk to a real person, get clear terms and drive away with confidence.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {config.service_areas.map((a) => (
                <span key={a} className="inline-flex items-center gap-1 rounded-full bg-cloud px-3 py-1.5 text-sm"><MapPin className="size-3.5 text-gold-600" aria-hidden />{a}</span>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {WHY.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-line p-6">
                <Icon className="size-7 text-gold-600" aria-hidden />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 sm:pb-24">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-white sm:px-12 sm:py-16">
            <div aria-hidden className="absolute -top-24 -right-24 size-80 rounded-full bg-gold/20 blur-3xl" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-bold sm:text-4xl">Ready for your next drive?</h2>
                <p className="mt-3 max-w-xl text-white/70">Send an enquiry in under a minute, or reach us directly. We usually reply within working hours.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg"><Link to="/enquire">Send an enquiry</Link></Button>
                <Button asChild size="lg" variant="outlineLight"><a href={telLink(config.phone)}><Phone aria-hidden /> {config.phone}</a></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
