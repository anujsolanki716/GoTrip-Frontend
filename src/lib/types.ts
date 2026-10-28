export type CarCategory = "hatchback" | "sedan" | "compact_suv" | "suv" | "muv" | "premium";
export type Transmission = "manual" | "automatic";
export type FuelType = "petrol" | "diesel" | "cng" | "electric" | "hybrid";
export type CarStatus = "available" | "on_request" | "under_maintenance" | "unavailable";
export type CustomerType = "student" | "corporate" | "resident" | "traveller" | "other";
export type PreferredContact = "whatsapp" | "phone" | "email";
export type EnquiryStatus = "new" | "contacted" | "in_discussion" | "converted_offline" | "not_converted" | "spam";

export interface CarImage {
  id: number;
  url: string;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  sort_order: number;
  is_primary: boolean;
}

export interface Car {
  id: number;
  slug: string;
  name: string;
  brand: string;
  model: string;
  variant: string | null;
  year: number;
  category: CarCategory;
  transmission: Transmission;
  fuel_type: FuelType;
  seats: number;
  luggage_bags: number | null;
  mileage_kmpl: number | null;
  color: string | null;
  daily_price: number;
  weekly_price: number | null;
  security_deposit: number | null;
  km_limit_per_day: number | null;
  extra_km_charge: number | null;
  fuel_policy: string | null;
  short_description: string | null;
  description: string | null;
  features: string[];
  additional_terms: string | null;
  location: string;
  status: CarStatus;
  is_featured: boolean;
  images: CarImage[];
}

export interface AdminCar extends Car {
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  enquiry_count: number;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface SiteConfig {
  business_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  service_areas: string[];
  online_booking: false;
  online_payment: false;
}

export interface EnquiryReceipt {
  reference: string;
  status: "received";
  is_booking: false;
  message: string;
}

export interface AdminEnquiry {
  id: number;
  reference: string;
  car_id: number | null;
  car_name_snapshot: string | null;
  car: { id: number; slug: string; name: string } | null;
  full_name: string;
  phone: string;
  email: string | null;
  customer_type: CustomerType;
  preferred_contact: PreferredContact;
  pickup_date: string | null;
  return_date: string | null;
  pickup_area: string | null;
  message: string | null;
  status: EnquiryStatus;
  admin_notes: string | null;
  contacted_at: string | null;
  converted_at: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "staff";
  last_login_at: string | null;
}

export interface AdminStats {
  cars_total: number;
  cars_published: number;
  enquiries_total: number;
  enquiries_new: number;
  enquiries_last_7_days: number;
  converted_offline: number;
  by_status: Record<EnquiryStatus, number>;
  top_cars: { car_id: number | null; name: string; enquiries: number }[];
  last_14_days: { day: string; count: number }[];
}
