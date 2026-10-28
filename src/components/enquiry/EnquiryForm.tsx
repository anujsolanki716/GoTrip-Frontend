import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { ApiError, api } from "@/lib/api";
import { LABELS, todayIST } from "@/lib/format";
import { type EnquiryFormValues, enquirySchema } from "@/lib/schemas";
import type { EnquiryReceipt } from "@/lib/types";
import { NotABookingNotice } from "./NotABookingNotice";

interface Props {
  carSlug?: string;
  carName?: string;
  source?: string;
  onSuccess: (receipt: EnquiryReceipt) => void;
}

const CUSTOMER_TYPES = ["student", "corporate", "resident", "traveller", "other"] as const;
const CONTACTS = ["whatsapp", "phone", "email"] as const;

export function EnquiryForm({ carSlug, carName, source = "website", onSuccess }: Props) {
  const config = useSiteConfig();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      car_slug: carSlug,
      full_name: "",
      phone: "",
      email: "",
      preferred_contact: "whatsapp",
      pickup_date: "",
      return_date: "",
      pickup_area: "",
      message: "",
      consent: false,
      website: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (v: EnquiryFormValues) =>
      api.createEnquiry({
        ...v,
        car_slug: carSlug ?? null,
        email: v.email || null,
        pickup_date: v.pickup_date || null,
        return_date: v.return_date || null,
        pickup_area: v.pickup_area || null,
        message: v.message || null,
        source,
      }),
    onSuccess,
    onError: (err) => {
      if (err instanceof ApiError) {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          if (field in enquirySchema.shape) setError(field as keyof EnquiryFormValues, { message });
        });
      }
    },
  });

  const pickup = watch("pickup_date");
  const today = todayIST();
  const formError = mutation.error instanceof ApiError ? mutation.error : mutation.error ? new ApiError(0, "Could not send your enquiry. Please check your connection or WhatsApp us.") : null;
  const showFormError = formError && Object.keys(formError.fieldErrors).length === 0;

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate className="space-y-5">
      {carName && (
        <p className="rounded-xl bg-cloud px-4 py-3 text-sm">
          Enquiring about: <strong className="font-semibold">{carName}</strong>
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="full_name" label="Full name" required error={errors.full_name?.message}>
          <Input autoComplete="name" {...register("full_name")} />
        </Field>
        <Field id="phone" label="Mobile number" required hint="We'll contact you on this number" error={errors.phone?.message}>
          <Input type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" {...register("phone")} />
        </Field>
        <Field id="email" label="Email (optional)" error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field id="customer_type" label="I am a" required error={errors.customer_type?.message}>
          <Select defaultValue="" {...register("customer_type")}>
            <option value="" disabled>Select one</option>
            {CUSTOMER_TYPES.map((t) => (
              <option key={t} value={t}>{LABELS[t]}</option>
            ))}
          </Select>
        </Field>
        <Field id="pickup_date" label="Preferred pickup date" error={errors.pickup_date?.message}>
          <Input type="date" min={today} {...register("pickup_date")} />
        </Field>
        <Field id="return_date" label="Preferred return date" error={errors.return_date?.message}>
          <Input type="date" min={pickup || today} {...register("return_date")} />
        </Field>
        <Field id="pickup_area" label="Pickup area" hint="e.g. Knowledge Park II, Pari Chowk" error={errors.pickup_area?.message} className="sm:col-span-2">
          <Input list="service-areas" autoComplete="address-level2" {...register("pickup_area")} />
        </Field>
        <datalist id="service-areas">
          {config.service_areas.map((a) => <option key={a} value={a} />)}
        </datalist>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">How should we contact you?</legend>
        <div className="flex flex-wrap gap-2">
          {CONTACTS.map((c) => (
            <label key={c} className="cursor-pointer">
              <input type="radio" value={c} className="peer sr-only" {...register("preferred_contact")} />
              <span className="inline-flex rounded-full border border-line px-4 py-2 text-sm transition peer-checked:border-gold peer-checked:bg-gold-100 peer-checked:font-semibold peer-focus-visible:outline-2 peer-focus-visible:outline-gold">
                {LABELS[c]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field id="message" label="Message (optional)" hint="Trip plans, questions about eligibility, documents or pricing" error={errors.message?.message}>
        <Textarea rows={4} {...register("message")} />
      </Field>

      {/* Honeypot for bots: hidden from people and assistive technology */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-ink/80">
          <input
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 accent-[#E9B949]"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            {...register("consent")}
          />
          <span>
            I agree to be contacted by GoTrip about this enquiry by phone, WhatsApp or email, and I understand that
            this enquiry is <strong>not a booking</strong>.
          </span>
        </label>
        {errors.consent && <p id="consent-error" role="alert" className="mt-1 text-xs font-medium text-destructive">{errors.consent.message}</p>}
      </div>

      <NotABookingNotice compact />

      {showFormError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError.message}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />}
        {mutation.isPending ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}
