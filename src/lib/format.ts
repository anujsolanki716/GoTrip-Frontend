const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export const formatINR = (value: number | null | undefined) => (value == null ? "—" : inr.format(value));

export const LABELS: Record<string, string> = {
  hatchback: "Hatchback",
  sedan: "Sedan",
  compact_suv: "Compact SUV",
  suv: "SUV",
  muv: "MUV / 7-Seater",
  premium: "Premium",
  manual: "Manual",
  automatic: "Automatic",
  petrol: "Petrol",
  diesel: "Diesel",
  cng: "CNG",
  electric: "Electric",
  hybrid: "Hybrid",
  available: "Available",
  on_request: "On request",
  under_maintenance: "Under maintenance",
  unavailable: "Currently unavailable",
  student: "College student",
  corporate: "Corporate / working professional",
  resident: "Local resident",
  traveller: "Weekend traveller",
  other: "Other",
  whatsapp: "WhatsApp",
  phone: "Phone call",
  email: "Email",
  new: "New",
  contacted: "Contacted",
  in_discussion: "In discussion",
  converted_offline: "Converted to offline rental",
  not_converted: "Not converted",
  spam: "Spam",
};

export const label = (value: string | null | undefined) => (value ? (LABELS[value] ?? value) : "—");

export const formatDate = (value: string | null | undefined, withTime = false) => {
  if (!value) return "—";
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
    timeZone: "Asia/Kolkata",
  });
};

export const todayIST = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date()); // YYYY-MM-DD

export const waLink = (number: string, text?: string) =>
  `https://wa.me/${number.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const telLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
