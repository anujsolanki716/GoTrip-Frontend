import type { AdminCar, AdminEnquiry, AdminStats, AdminUser, Car, CarImage, EnquiryReceipt, Page, SiteConfig } from "./types";

const BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const API = `${BASE}/api/v1`;

export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string>;
  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

type Query = Record<string, string | number | boolean | string[] | undefined | null>;

function qs(params?: Query) {
  if (!params) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    if (Array.isArray(v)) v.forEach((item) => sp.append(k, item));
    else sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

interface ValidationItem {
  loc: (string | number)[];
  msg: string;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("X-Requested-With", "XMLHttpRequest");
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const res = await fetch(`${API}${path}`, { ...init, headers, credentials: "include" });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = data?.detail;
    if (Array.isArray(detail)) {
      const fieldErrors: Record<string, string> = {};
      (detail as ValidationItem[]).forEach((d) => {
        const field = String(d.loc[d.loc.length - 1] ?? "form");
        fieldErrors[field] = d.msg.replace(/^Value error, /, "");
      });
      throw new ApiError(res.status, Object.values(fieldErrors)[0] ?? "Please check the form", fieldErrors);
    }
    throw new ApiError(res.status, typeof detail === "string" ? detail : "Something went wrong. Please try again.");
  }
  return data as T;
}

export const mediaUrl = (url: string) => (url.startsWith("http") ? url : `${BASE}${url}`);

export interface CarQuery {
  q?: string;
  category?: string[];
  transmission?: string;
  fuel_type?: string[];
  min_seats?: number;
  max_price?: number;
  featured?: boolean;
  available_only?: boolean;
  sort?: string;
  page?: number;
  page_size?: number;
}

export interface EnquiryInput {
  car_slug?: string | null;
  full_name: string;
  phone: string;
  email?: string | null;
  customer_type: string;
  preferred_contact: string;
  pickup_date?: string | null;
  return_date?: string | null;
  pickup_area?: string | null;
  message?: string | null;
  consent: boolean;
  source?: string;
  website?: string;
}

export const api = {
  siteConfig: () => request<SiteConfig>("/site/config"),
  cars: (query: CarQuery = {}) => request<Page<Car>>(`/cars${qs(query as Query)}`),
  car: (slug: string) => request<Car>(`/cars/${encodeURIComponent(slug)}`),
  similarCars: (slug: string) => request<Car[]>(`/cars/${encodeURIComponent(slug)}/similar`),
  createEnquiry: (body: EnquiryInput) =>
    request<EnquiryReceipt>("/enquiries", { method: "POST", body: JSON.stringify(body) }),
};

export interface EnquiryQuery {
  status?: string[];
  q?: string;
  car_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}

export type CarPayload = Partial<Omit<AdminCar, "id" | "images" | "created_at" | "updated_at" | "enquiry_count">>;

export const adminApi = {
  login: (email: string, password: string) =>
    request<{ admin: AdminUser; expires_at: string }>("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request<void>("/admin/auth/logout", { method: "POST" }),
  me: () => request<AdminUser>("/admin/auth/me"),
  changePassword: (current_password: string, new_password: string) =>
    request<void>("/admin/auth/password", { method: "POST", body: JSON.stringify({ current_password, new_password }) }),
  stats: () => request<AdminStats>("/admin/stats"),
  cars: (params: { q?: string; published?: boolean } = {}) => request<AdminCar[]>(`/admin/cars${qs(params)}`),
  car: (id: number) => request<AdminCar>(`/admin/cars/${id}`),
  createCar: (body: CarPayload) => request<AdminCar>("/admin/cars", { method: "POST", body: JSON.stringify(body) }),
  updateCar: (id: number, body: CarPayload) =>
    request<AdminCar>(`/admin/cars/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteCar: (id: number) => request<void>(`/admin/cars/${id}`, { method: "DELETE" }),
  uploadImage: (carId: number, file: File, altText?: string) => {
    const form = new FormData();
    form.append("file", file);
    if (altText) form.append("alt_text", altText);
    return request<CarImage>(`/admin/cars/${carId}/images`, { method: "POST", body: form });
  },
  updateImage: (carId: number, imageId: number, body: Partial<Pick<CarImage, "alt_text" | "sort_order" | "is_primary">>) =>
    request<CarImage>(`/admin/cars/${carId}/images/${imageId}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteImage: (carId: number, imageId: number) =>
    request<void>(`/admin/cars/${carId}/images/${imageId}`, { method: "DELETE" }),
  enquiries: (query: EnquiryQuery) => request<Page<AdminEnquiry>>(`/admin/enquiries${qs(query as Query)}`),
  enquiry: (id: number) => request<AdminEnquiry>(`/admin/enquiries/${id}`),
  updateEnquiry: (id: number, body: { status?: string; admin_notes?: string | null }) =>
    request<AdminEnquiry>(`/admin/enquiries/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  exportUrl: (query: EnquiryQuery) => `${API}/admin/enquiries/export.csv${qs(query as Query)}`,
};
