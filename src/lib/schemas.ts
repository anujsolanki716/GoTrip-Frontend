import { z } from "zod";
import { todayIST } from "./format";

const MOBILE = /^(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/;

export const enquirySchema = z
  .object({
    car_slug: z.string().optional(),
    full_name: z
      .string()
      .trim()
      .min(2, "Please enter your full name")
      .max(100, "Name is too long")
      .regex(/^[\p{L}][\p{L} .'-]*$/u, "Please use letters only"),
    phone: z.string().trim().regex(MOBILE, "Enter a valid 10-digit Indian mobile number"),
    email: z.union([z.literal(""), z.email("Enter a valid email address")]),
    customer_type: z.enum(["student", "corporate", "resident", "traveller", "other"], {
      error: "Please tell us who you are",
    }),
    preferred_contact: z.enum(["whatsapp", "phone", "email"]),
    pickup_date: z.string(),
    return_date: z.string(),
    pickup_area: z.string().trim().max(120),
    message: z.string().trim().max(2000, "Please keep your message under 2000 characters"),
    consent: z.boolean().refine((v) => v, "Please agree so our team can contact you"),
    website: z.string().max(0).optional(), // honeypot
  })
  .superRefine((v, ctx) => {
    const today = todayIST();
    if (v.pickup_date && v.pickup_date < today)
      ctx.addIssue({ code: "custom", path: ["pickup_date"], message: "Pickup date cannot be in the past" });
    if (v.return_date && !v.pickup_date)
      ctx.addIssue({ code: "custom", path: ["pickup_date"], message: "Please choose a pickup date" });
    if (v.return_date && v.pickup_date && v.return_date < v.pickup_date)
      ctx.addIssue({ code: "custom", path: ["return_date"], message: "Return date must be after pickup" });
    if (v.preferred_contact === "email" && !v.email)
      ctx.addIssue({ code: "custom", path: ["email"], message: "Add your email if you prefer email contact" });
  });

export type EnquiryFormValues = z.infer<typeof enquirySchema>;
