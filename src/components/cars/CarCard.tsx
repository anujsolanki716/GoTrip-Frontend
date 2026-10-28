import { ArrowRight, Fuel, Gauge, Users } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { formatINR, label } from "@/lib/format";
import type { Car } from "@/lib/types";
import { CarPhoto } from "./CarPhoto";
import { StatusBadge } from "./StatusBadge";

export function CarCard({ car }: { car: Car }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10">
      <div className="relative aspect-[16/10] overflow-hidden">
        <CarPhoto car={car} className="transition duration-500 group-hover:scale-105" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge tone="dark" className="bg-ink/80 backdrop-blur">{label(car.category)}</Badge>
          {car.is_featured && <Badge tone="gold">Popular</Badge>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted">{car.brand} · {car.year}</p>
            <h3 className="mt-0.5 text-lg font-semibold">
              <Link to={`/cars/${car.slug}`} className="after:absolute after:inset-0 focus:outline-none">
                {car.name}
              </Link>
            </h3>
          </div>
          <StatusBadge status={car.status} />
        </div>
        <ul className="mt-4 grid grid-cols-3 gap-2 text-xs text-ink/75">
          <li className="flex items-center gap-1.5"><Users className="size-4 text-gold-600" aria-hidden />{car.seats} seats</li>
          <li className="flex items-center gap-1.5"><Gauge className="size-4 text-gold-600" aria-hidden />{label(car.transmission)}</li>
          <li className="flex items-center gap-1.5"><Fuel className="size-4 text-gold-600" aria-hidden />{label(car.fuel_type)}</li>
        </ul>
        <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
          <div>
            <p className="text-[11px] tracking-wide text-muted uppercase">From (indicative)</p>
            <p className="font-display text-xl font-bold">
              {formatINR(car.daily_price)}
              <span className="text-sm font-medium text-muted"> /day</span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink transition group-hover:text-gold-600">
            View details <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}
