import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { ApiError, adminApi, mediaUrl, type CarPayload } from "@/lib/api";
import { LABELS } from "@/lib/format";
import type { AdminCar } from "@/lib/types";
import { AdminPageHeader } from "./AdminLayout";
import { useAdmin } from "./auth";

const int = (msg = "Enter a whole number") => z.string().trim().regex(/^\d*$/, msg);
const required = (msg: string) => z.string().trim().min(1, msg);

const schema = z.object({
  name: required("Name is required").max(120),
  brand: required("Brand is required").max(60),
  model: required("Model is required").max(60),
  variant: z.string().max(60),
  year: int().min(4, "Enter the model year"),
  slug: z.string().trim().regex(/^([a-z0-9]+(-[a-z0-9]+)*)?$/, "Lowercase letters, numbers and hyphens only"),
  category: z.enum(["hatchback", "sedan", "compact_suv", "suv", "muv", "premium"]),
  transmission: z.enum(["manual", "automatic"]),
  fuel_type: z.enum(["petrol", "diesel", "cng", "electric", "hybrid"]),
  seats: int().min(1, "Required"),
  luggage_bags: int(),
  mileage_kmpl: z.string().trim().regex(/^(\d+(\.\d)?)?$/, "e.g. 18.5"),
  color: z.string().max(40),
  daily_price: int().min(1, "Daily price is required"),
  weekly_price: int(),
  security_deposit: int(),
  km_limit_per_day: int(),
  extra_km_charge: int(),
  fuel_policy: z.string().max(200),
  short_description: z.string().max(240),
  description: z.string().max(5000),
  features: z.string().max(3000),
  additional_terms: z.string().max(5000),
  location: required("Location is required").max(120),
  status: z.enum(["available", "on_request", "under_maintenance", "unavailable"]),
  is_published: z.boolean(),
  is_featured: z.boolean(),
  sort_order: int(),
});
type Values = z.infer<typeof schema>;

const EMPTY: Values = {
  name: "", brand: "", model: "", variant: "", year: String(new Date().getFullYear()), slug: "",
  category: "hatchback", transmission: "manual", fuel_type: "petrol", seats: "5", luggage_bags: "", mileage_kmpl: "",
  color: "", daily_price: "", weekly_price: "", security_deposit: "", km_limit_per_day: "250", extra_km_charge: "10",
  fuel_policy: "Same-to-same fuel level", short_description: "", description: "", features: "", additional_terms: "",
  location: "Greater Noida", status: "available", is_published: false, is_featured: false, sort_order: "0",
};

const s = (v: unknown) => (v === null || v === undefined ? "" : String(v));
function toValues(car: AdminCar): Values {
  return {
    ...EMPTY,
    ...Object.fromEntries(Object.keys(EMPTY).map((k) => [k, typeof EMPTY[k as keyof Values] === "boolean" ? car[k as keyof AdminCar] : s(car[k as keyof AdminCar])])),
    features: car.features.join("\n"),
  } as Values;
}
const optInt = (v: string) => (v ? Number(v) : null);
const optStr = (v: string) => v.trim() || null;
function toPayload(v: Values): CarPayload {
  return {
    name: v.name, brand: v.brand, model: v.model, variant: optStr(v.variant), year: Number(v.year),
    ...(v.slug ? { slug: v.slug } : {}),
    category: v.category, transmission: v.transmission, fuel_type: v.fuel_type, seats: Number(v.seats),
    luggage_bags: optInt(v.luggage_bags), mileage_kmpl: v.mileage_kmpl ? Number(v.mileage_kmpl) : null, color: optStr(v.color),
    daily_price: Number(v.daily_price), weekly_price: optInt(v.weekly_price), security_deposit: optInt(v.security_deposit),
    km_limit_per_day: optInt(v.km_limit_per_day), extra_km_charge: optInt(v.extra_km_charge), fuel_policy: optStr(v.fuel_policy),
    short_description: optStr(v.short_description), description: optStr(v.description),
    features: v.features.split("\n").map((f) => f.trim()).filter(Boolean),
    additional_terms: optStr(v.additional_terms), location: v.location, status: v.status,
    is_published: v.is_published, is_featured: v.is_featured, sort_order: Number(v.sort_order || 0),
  };
}

function ImageManager({ car }: { car: AdminCar }) {
  const qc = useQueryClient();
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", "car", car.id] });
    qc.invalidateQueries({ queryKey: ["admin", "cars"] });
  };
  const upload = useMutation({
    mutationFn: async (files: File[]) => {
      for (const f of files) await adminApi.uploadImage(car.id, f, car.name);
    },
    onSuccess: refresh,
    onError: (e) => setError((e as Error).message),
    onSettled: refresh,
  });
  const primary = useMutation({ mutationFn: (id: number) => adminApi.updateImage(car.id, id, { is_primary: true }), onSuccess: refresh });
  const remove = useMutation({ mutationFn: (id: number) => adminApi.deleteImage(car.id, id), onSuccess: refresh });

  return (
    <Card>
      <CardHeader><CardTitle>Photos</CardTitle><p className="text-sm text-muted">JPEG, PNG or WebP. Images are resized and EXIF/location data is removed. The starred photo is shown first.</p></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {car.images.map((img) => (
            <div key={img.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-line">
              <img src={mediaUrl(img.url)} alt={img.alt_text ?? ""} className="h-full w-full object-cover" />
              {img.is_primary && <Badge tone="gold" className="absolute top-2 left-2"><Star className="size-3" aria-hidden /> Main</Badge>}
              <div className="absolute inset-x-2 bottom-2 flex justify-end gap-1.5">
                {!img.is_primary && (
                  <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => primary.mutate(img.id)} aria-label="Set as main photo"><Star /></Button>
                )}
                <Button type="button" size="sm" variant="destructive" className="h-8 px-2" aria-label="Delete photo"
                  onClick={() => window.confirm("Delete this photo?") && remove.mutate(img.id)}><Trash2 /></Button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => input.current?.click()} disabled={upload.isPending}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line text-sm text-muted transition hover:border-gold hover:text-ink">
            {upload.isPending ? <Loader2 className="size-6 animate-spin" aria-hidden /> : <ImagePlus className="size-6" aria-hidden />}
            {upload.isPending ? "Uploading…" : "Add photos"}
          </button>
        </div>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden
          onChange={(e) => { setError(null); const files = Array.from(e.target.files ?? []); if (files.length) upload.mutate(files); e.target.value = ""; }} />
        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      </CardContent>
    </Card>
  );
}

export function AdminCarFormPage() {
  const params = useParams();
  const isNew = params.id === undefined;
  const id = Number(params.id);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: admin } = useAdmin();
  const car = useQuery({ queryKey: ["admin", "car", id], queryFn: () => adminApi.car(id), enabled: !isNew });
  useDocumentTitle(isNew ? "Add car" : car.data ? `Edit ${car.data.name}` : "Edit car");
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, reset, setError, formState: { errors, isDirty } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: EMPTY });
  useEffect(() => { if (car.data) reset(toValues(car.data)); }, [car.data, reset]);

  const save = useMutation({
    mutationFn: (v: Values) => (isNew ? adminApi.createCar(toPayload(v)) : adminApi.updateCar(id, toPayload(v))),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: ["admin", "cars"] });
      qc.invalidateQueries({ queryKey: ["cars"] });
      qc.setQueryData(["admin", "car", result.id], result);
      setSaved(true);
      if (isNew) navigate(`/admin/cars/${result.id}`, { replace: true });
      else reset(toValues(result));
    },
    onError: (e) => {
      setServerError((e as Error).message);
      if (e instanceof ApiError) Object.entries(e.fieldErrors).forEach(([k, m]) => k in EMPTY && setError(k as keyof Values, { message: m }));
    },
  });
  const del = useMutation({
    mutationFn: () => adminApi.deleteCar(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "cars"] }); navigate("/admin/cars"); },
    onError: (e) => setServerError((e as Error).message),
  });

  if (!isNew && car.isLoading) return <p className="text-muted">Loading…</p>;
  const opt = (values: string[]) => values.map((v) => <option key={v} value={v}>{LABELS[v] ?? v}</option>);
  const text = (name: keyof Values, labelText: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, req = false) => (
    <Field id={name} label={labelText} required={req} error={errors[name]?.message}><Input {...props} {...register(name)} /></Field>
  );

  return (
    <>
      <Link to="/admin/cars" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><ChevronLeft className="size-4" aria-hidden /> Cars</Link>
      <AdminPageHeader
        title={isNew ? "Add car" : (car.data?.name ?? "Edit car")}
        description={!isNew && car.data ? `/cars/${car.data.slug}` : "New cars are saved as drafts until you publish them."}
        actions={!isNew && car.data?.is_published ? <Button asChild variant="outline" size="sm"><a href={`/cars/${car.data.slug}`} target="_blank" rel="noopener">View on site</a></Button> : undefined}
      />
      <form onSubmit={handleSubmit((v) => { setServerError(null); setSaved(false); save.mutate(v); })} noValidate className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Car details</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {text("name", "Display name", { placeholder: "Hyundai Creta" }, true)}
            {text("brand", "Brand", {}, true)}
            {text("model", "Model", {}, true)}
            {text("variant", "Variant")}
            {text("year", "Model year", { inputMode: "numeric" }, true)}
            {text("color", "Colour")}
            <Field id="category" label="Category" required><Select {...register("category")}>{opt(["hatchback", "sedan", "compact_suv", "suv", "muv", "premium"])}</Select></Field>
            <Field id="transmission" label="Transmission" required><Select {...register("transmission")}>{opt(["manual", "automatic"])}</Select></Field>
            <Field id="fuel_type" label="Fuel" required><Select {...register("fuel_type")}>{opt(["petrol", "diesel", "cng", "electric", "hybrid"])}</Select></Field>
            {text("seats", "Seats", { inputMode: "numeric" }, true)}
            {text("luggage_bags", "Luggage (bags)", { inputMode: "numeric" })}
            {text("mileage_kmpl", "Mileage (km/l)", { inputMode: "decimal" })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Indicative pricing & terms (INR)</CardTitle><p className="text-sm text-muted">Shown as indicative. Final pricing is agreed offline.</p></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {text("daily_price", "Daily price", { inputMode: "numeric" }, true)}
            {text("weekly_price", "Weekly price", { inputMode: "numeric" })}
            {text("security_deposit", "Security deposit", { inputMode: "numeric" })}
            {text("km_limit_per_day", "Km included per day", { inputMode: "numeric" })}
            {text("extra_km_charge", "Extra km charge (₹/km)", { inputMode: "numeric" })}
            {text("fuel_policy", "Fuel policy")}
            <Field id="additional_terms" label="Car-specific terms" className="sm:col-span-2 lg:col-span-3"><Textarea rows={3} {...register("additional_terms")} /></Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Description</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <Field id="short_description" label="Short description" hint="One line shown at the top of the car page (max 240)" error={errors.short_description?.message}><Input {...register("short_description")} /></Field>
            <Field id="description" label="Full description" error={errors.description?.message}><Textarea rows={5} {...register("description")} /></Field>
            <Field id="features" label="Features" hint="One per line"><Textarea rows={5} {...register("features")} /></Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Listing</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field id="status" label="Availability (indicative)"><Select {...register("status")}>{opt(["available", "on_request", "under_maintenance", "unavailable"])}</Select></Field>
            {text("location", "Location", {}, true)}
            {text("slug", "URL slug", { placeholder: "auto-generated" })}
            {text("sort_order", "Sort order", { inputMode: "numeric" })}
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="size-4 accent-[#E9B949]" {...register("is_published")} /> Published on website</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="size-4 accent-[#E9B949]" {...register("is_featured")} /> Featured on home page</label>
          </CardContent>
        </Card>

        {serverError && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>}
        {saved && !isDirty && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Saved.</p>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button type="submit" size="lg" disabled={save.isPending}>{save.isPending && <Loader2 className="animate-spin" aria-hidden />} {isNew ? "Create car" : "Save changes"}</Button>
          {!isNew && admin?.role === "admin" && (
            <Button type="button" variant="destructive" onClick={() => window.confirm("Delete this car permanently? Past enquiries keep the car name.") && del.mutate()}>
              <Trash2 aria-hidden /> Delete car
            </Button>
          )}
        </div>
      </form>
      {!isNew && car.data && <div className="mt-6"><ImageManager car={car.data} /></div>}
    </>
  );
}
