import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff, Plus, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { CarPhoto } from "@/components/cars/CarPhoto";
import { StatusBadge } from "@/components/cars/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { adminApi } from "@/lib/api";
import { formatINR, label } from "@/lib/format";
import { AdminPageHeader } from "./AdminLayout";

export function AdminCarsPage() {
  useDocumentTitle("Cars");
  const [q, setQ] = useState("");
  const cars = useQuery({ queryKey: ["admin", "cars", q], queryFn: () => adminApi.cars({ q: q || undefined }) });
  return (
    <>
      <AdminPageHeader title="Cars" description="Manage listings, indicative prices and photos." actions={<Button asChild size="sm"><Link to="/admin/cars/new"><Plus aria-hidden /> Add car</Link></Button>} />
      <Input type="search" placeholder="Search cars" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-xs bg-white" aria-label="Search cars" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cars.data?.map((car) => (
          <Link key={car.id} to={`/admin/cars/${car.id}`} className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:shadow-md">
            <div className="relative aspect-[16/9]">
              <CarPhoto car={car} />
              <div className="absolute top-2 left-2 flex gap-1.5">
                {car.is_published ? <Badge tone="green"><Eye className="size-3" aria-hidden /> Published</Badge> : <Badge tone="dark"><EyeOff className="size-3" aria-hidden /> Draft</Badge>}
                {car.is_featured && <Badge tone="gold"><Star className="size-3" aria-hidden /> Featured</Badge>}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{car.name}</p>
                  <p className="text-xs text-muted">{label(car.category)} · {label(car.transmission)} · {label(car.fuel_type)} · {car.year}</p>
                </div>
                <StatusBadge status={car.status} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold">{formatINR(car.daily_price)}/day</span>
                <span className="text-muted">{car.enquiry_count} enquiries · {car.images.length} photos</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {cars.data?.length === 0 && <p className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-muted">No cars yet. Add your first car.</p>}
    </>
  );
}
