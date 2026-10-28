import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { CarCard } from "@/components/cars/CarCard";
import { CarGridSkeleton } from "@/components/cars/CarGridSkeleton";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { api } from "@/lib/api";
import { LABELS } from "@/lib/format";
import { cn } from "@/lib/utils";

const CATEGORIES = ["hatchback", "sedan", "compact_suv", "suv", "muv", "premium"];
const FUELS = ["petrol", "diesel", "cng", "electric"];
const SORTS = [
  ["recommended", "Recommended"],
  ["price_asc", "Price: low to high"],
  ["price_desc", "Price: high to low"],
  ["newest", "Newest models"],
  ["seats_desc", "Most seats"],
] as const;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition",
        active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/30",
      )}
    >
      {children}
    </button>
  );
}

export function CarsPage() {
  useDocumentTitle("Self-drive cars in Greater Noida", "Browse GoTrip's self-drive hatchbacks, sedans, SUVs and 7-seaters with indicative daily prices.");
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const category = params.getAll("category");
  const fuel = params.getAll("fuel_type");
  const transmission = params.get("transmission") ?? "";
  const minSeats = params.get("min_seats") ?? "";
  const maxPrice = params.get("max_price") ?? "";
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "recommended";
  const page = Number(params.get("page") ?? 1);

  const query = useQuery({
    queryKey: ["cars", params.toString()],
    queryFn: () =>
      api.cars({
        q: q || undefined,
        category,
        fuel_type: fuel,
        transmission: transmission || undefined,
        min_seats: minSeats ? Number(minSeats) : undefined,
        max_price: maxPrice ? Number(maxPrice) : undefined,
        sort,
        page,
        page_size: 12,
      }),
    placeholderData: keepPreviousData,
  });

  const update = (mutate: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params);
    mutate(next);
    next.delete("page");
    setParams(next, { replace: true });
  };
  const toggle = (key: string, value: string) =>
    update((p) => {
      const values = p.getAll(key);
      p.delete(key);
      (values.includes(value) ? values.filter((v) => v !== value) : [...values, value]).forEach((v) => p.append(key, v));
    });
  const setValue = (key: string, value: string) => update((p) => (value ? p.set(key, value) : p.delete(key)));
  const activeCount = category.length + fuel.length + [transmission, minSeats, maxPrice, q].filter(Boolean).length;

  const filters = (
    <div className="space-y-6">
      <div>
        <label htmlFor="car-search" className="mb-2 block text-sm font-semibold">Search</label>
        <Input id="car-search" type="search" placeholder="Brand or model" defaultValue={q} onChange={(e) => setValue("q", e.target.value.trim())} />
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Car type</legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => <Chip key={c} active={category.includes(c)} onClick={() => toggle("category", c)}>{LABELS[c]}</Chip>)}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Transmission</legend>
        <div className="flex flex-wrap gap-2">
          {["manual", "automatic"].map((t) => <Chip key={t} active={transmission === t} onClick={() => setValue("transmission", transmission === t ? "" : t)}>{LABELS[t]}</Chip>)}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Fuel</legend>
        <div className="flex flex-wrap gap-2">
          {FUELS.map((f) => <Chip key={f} active={fuel.includes(f)} onClick={() => toggle("fuel_type", f)}>{LABELS[f]}</Chip>)}
        </div>
      </fieldset>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="min-seats" className="mb-2 block text-sm font-semibold">Seats</label>
          <Select id="min-seats" value={minSeats} onChange={(e) => setValue("min_seats", e.target.value)}>
            <option value="">Any</option>
            <option value="5">5+</option>
            <option value="7">7+</option>
          </Select>
        </div>
        <div>
          <label htmlFor="max-price" className="mb-2 block text-sm font-semibold">Max ₹/day</label>
          <Select id="max-price" value={maxPrice} onChange={(e) => setValue("max_price", e.target.value)}>
            <option value="">Any</option>
            {[2000, 2500, 3000, 4000, 5000].map((p) => <option key={p} value={p}>₹{p.toLocaleString("en-IN")}</option>)}
          </Select>
        </div>
      </div>
      {activeCount > 0 && (
        <Button variant="ghost" size="sm" onClick={() => setParams(new URLSearchParams(sort !== "recommended" ? { sort } : {}))}>
          <X aria-hidden /> Clear filters
        </Button>
      )}
    </div>
  );

  const data = query.data;
  return (
    <>
      <PageHero eyebrow="Our fleet" title="Find your self-drive car">
        Indicative daily prices are shown. Final pricing, availability and eligibility are confirmed by our team.
      </PageHero>
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[280px_1fr] lg:py-14">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-28">{filters}</div>
        </aside>
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted" aria-live="polite">
              {data ? `${data.total} car${data.total === 1 ? "" : "s"} found` : "Loading cars…"}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters}>
                <SlidersHorizontal aria-hidden /> Filters{activeCount ? ` (${activeCount})` : ""}
              </Button>
              <label htmlFor="sort" className="sr-only">Sort by</label>
              <Select id="sort" value={sort} onChange={(e) => setValue("sort", e.target.value === "recommended" ? "" : e.target.value)} className="h-9 w-auto">
                {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </Select>
            </div>
          </div>
          {showFilters && <div className="mb-8 rounded-2xl border border-line p-5 lg:hidden">{filters}</div>}

          {query.isLoading ? (
            <CarGridSkeleton />
          ) : query.isError ? (
            <div className="rounded-2xl bg-red-50 p-8 text-center text-red-700" role="alert">
              We couldn't load cars right now. Please refresh, or WhatsApp us for availability.
            </div>
          ) : data && data.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line p-12 text-center">
              <p className="font-semibold">No cars match these filters</p>
              <p className="mt-1 text-sm text-muted">Try removing a filter, or tell us what you need and we'll help.</p>
            </div>
          ) : (
            <div className={cn("grid gap-6 sm:grid-cols-2 xl:grid-cols-3 transition-opacity", query.isFetching && "opacity-60")}>
              {data?.items.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          )}

          {data && data.pages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setParams((p) => { p.set("page", String(page - 1)); return p; })}>
                <ChevronLeft aria-hidden /> Previous
              </Button>
              <span className="text-sm">Page {page} of {data.pages}</span>
              <Button variant="outline" size="sm" disabled={page >= data.pages} onClick={() => setParams((p) => { p.set("page", String(page + 1)); return p; })}>
                Next <ChevronRight aria-hidden />
              </Button>
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
