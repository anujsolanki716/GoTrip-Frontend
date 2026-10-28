import { useQuery } from "@tanstack/react-query";
import {
  Armchair,
  Briefcase,
  CalendarDays,
  Check,
  ChevronLeft,
  Fuel,
  Gauge,
  MapPin,
  Palette,
  Phone,
  Route,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { CarCard } from "@/components/cars/CarCard";
import { CarIllustration } from "@/components/cars/CarIllustration";
import { StatusBadge } from "@/components/cars/StatusBadge";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { EnquirySuccess } from "@/components/enquiry/EnquirySuccess";
import { WhatsAppIcon } from "@/components/layout/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { ApiError, api, mediaUrl } from "@/lib/api";
import { formatINR, label, telLink, waLink } from "@/lib/format";
import type { Car, EnquiryReceipt } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NotFoundPage } from "./NotFoundPage";

function Gallery({ car }: { car: Car }) {
  const [active, setActive] = useState(0);
  if (car.images.length === 0) {
    return <div className="aspect-[16/10] overflow-hidden rounded-2xl"><CarIllustration category={car.category} /></div>;
  }
  const img = car.images[Math.min(active, car.images.length - 1)];
  return (
    <div>
      <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-cloud">
        <img src={mediaUrl(img.url)} alt={img.alt_text ?? car.name} className="h-full w-full object-cover" />
      </div>
      {car.images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Car photos">
          {car.images.map((im, i) => (
            <button
              key={im.id}
              role="tab"
              aria-selected={i === active}
              aria-label={`Photo ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn("h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition", i === active ? "border-gold" : "border-transparent opacity-70 hover:opacity-100")}
            >
              <img src={mediaUrl(im.url)} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function CarDetailPage() {
  const { slug = "" } = useParams();
  const config = useSiteConfig();
  const [receipt, setReceipt] = useState<EnquiryReceipt | null>(null);
  const carQuery = useQuery({ queryKey: ["car", slug], queryFn: () => api.car(slug), retry: (n, e) => !(e instanceof ApiError && e.status === 404) && n < 2 });
  const similar = useQuery({ queryKey: ["car", slug, "similar"], queryFn: () => api.similarCars(slug), enabled: carQuery.isSuccess });
  const car = carQuery.data;
  useDocumentTitle(car ? `${car.name} self-drive rental` : "Car details", car?.short_description ?? undefined);
  
  useEffect(() => {
    setReceipt(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);
  if (carQuery.error instanceof ApiError && carQuery.error.status === 404) return <NotFoundPage message="This car isn't listed right now." />;
  if (carQuery.isError) return <div className="container-page py-20 text-center" role="alert">We couldn't load this car. Please try again shortly.</div>;
  if (!car) {
    return (
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_400px]">
        <Skeleton className="aspect-[16/10]" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const specs = [
    { icon: Users, k: "Seats", v: `${car.seats}` },
    { icon: Gauge, k: "Transmission", v: label(car.transmission) },
    { icon: Fuel, k: "Fuel", v: label(car.fuel_type) },
    { icon: Briefcase, k: "Luggage", v: car.luggage_bags != null ? `${car.luggage_bags} bags` : "—" },
    { icon: Route, k: "Mileage", v: car.mileage_kmpl ? `${car.mileage_kmpl} km/l (ARAI)` : "—" },
    { icon: CalendarDays, k: "Model year", v: `${car.year}` },
    { icon: Palette, k: "Colour", v: car.color ?? "—" },
    { icon: Armchair, k: "Variant", v: car.variant ?? "—" },
  ];
  const pricing = [
    ["Daily rate (indicative)", `${formatINR(car.daily_price)} / day`],
    ["Weekly rate (indicative)", car.weekly_price ? `${formatINR(car.weekly_price)} / week` : "Ask our team"],
    ["Refundable security deposit", car.security_deposit ? `${formatINR(car.security_deposit)} (collected offline)` : "Discussed with our team"],
    ["Included km", car.km_limit_per_day ? `${car.km_limit_per_day} km / day` : "Discussed with our team"],
    ["Extra km", car.extra_km_charge ? `${formatINR(car.extra_km_charge)} / km` : "—"],
    ["Fuel policy", car.fuel_policy ?? "Same-to-same"],
  ];
  const waText = `Hi GoTrip, I'm interested in the ${car.name} (${car.year}). Is it available?`;
  

  return (
    <>
      <div className="border-b border-line bg-cloud">
        <div className="container-page py-3">
          <Link to="/cars" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
            <ChevronLeft className="size-4" aria-hidden /> All cars
          </Link>
        </div>
      </div>
      <div className="container-page grid gap-10 py-8 lg:grid-cols-[1fr_420px] lg:py-12">
        <div className="min-w-0">
          <Gallery car={car} />
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Badge tone="dark">{label(car.category)}</Badge>
            <StatusBadge status={car.status} />
            <Badge><MapPin className="size-3" aria-hidden />{car.location}</Badge>
          </div>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{car.name}</h1>
          <p className="mt-1 text-muted">{car.brand} {car.model} {car.variant} · {car.year}</p>
          {car.short_description && <p className="mt-4 text-lg text-ink/80">{car.short_description}</p>}

          <section className="mt-10" aria-labelledby="specs">
            <h2 id="specs" className="text-xl font-semibold">Specifications</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map(({ icon: Icon, k, v }) => (
                <div key={k} className="rounded-xl bg-cloud p-4">
                  <Icon className="size-5 text-gold-600" aria-hidden />
                  <dt className="mt-2 text-xs text-muted">{k}</dt>
                  <dd className="text-sm font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {car.description && (
            <section className="mt-10" aria-labelledby="about-car">
              <h2 id="about-car" className="text-xl font-semibold">About this car</h2>
              <p className="mt-3 leading-relaxed whitespace-pre-line text-ink/80">{car.description}</p>
            </section>
          )}

          {car.features.length > 0 && (
            <section className="mt-10" aria-labelledby="features">
              <h2 id="features" className="text-xl font-semibold">Features</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {car.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm"><Check className="size-4 text-emerald-600" aria-hidden />{f}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-10" aria-labelledby="pricing">
            <h2 id="pricing" className="text-xl font-semibold">Indicative pricing & key terms</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-sm">
                <tbody>
                  {pricing.map(([k, v]) => (
                    <tr key={k} className="border-b border-line last:border-0">
                      <th scope="row" className="w-1/2 bg-cloud/60 px-4 py-3 text-left font-medium text-muted">{k}</th>
                      <td className="px-4 py-3 font-medium">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted">
              Prices are indicative, may vary by dates and duration, and are confirmed by our team before any rental. Taxes,
              tolls, parking, fuel and challans are extra unless stated. See our <Link to="/policies" className="underline">rental policies</Link>.
            </p>
            {car.additional_terms && (
              <div className="mt-4 rounded-xl border border-line p-4 text-sm">
                <p className="font-semibold">Additional terms for this car</p>
                <p className="mt-1 whitespace-pre-line text-ink/80">{car.additional_terms}</p>
              </div>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Enquire about this car">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-lg shadow-ink/5 sm:p-6">
            {receipt ? (
              <EnquirySuccess receipt={receipt} carName={car.name} />
            ) : (
              <>
                <p className="text-xs tracking-wide text-muted uppercase">From (indicative)</p>
                <p className="font-display text-3xl font-bold">{formatINR(car.daily_price)}<span className="text-base font-medium text-muted"> /day</span></p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button asChild variant="whatsapp" size="sm">
                    <a href={waLink(config.whatsapp, waText)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="size-4" /> WhatsApp</a>
                  </Button>
                  <Button asChild variant="dark" size="sm">
                    <a href={telLink(config.phone)}><Phone aria-hidden /> Call us</a>
                  </Button>
                </div>
                <div className="my-5 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />or send an enquiry<span className="h-px flex-1 bg-line" /></div>
                <EnquiryForm carSlug={car.slug} source="car_detail" onSuccess={setReceipt} />
              </>
            )}
          </div>
        </aside>
      </div>

      {similar.data && similar.data.length > 0 && (
        <section className="bg-cloud py-14" aria-labelledby="similar">
          <div className="container-page">
            <h2 id="similar" className="text-2xl font-bold">You may also like</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.data.map((c) => <CarCard key={c.id} car={c} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
