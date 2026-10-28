import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { SiteConfig } from "@/lib/types";

// Shown until the API responds (and if it is unreachable) so contact links always work.
export const FALLBACK_CONFIG: SiteConfig = {
  business_name: "GoTrip",
  tagline: "Your Journey, Your Rules.",
  phone: "+91 90000 00000",
  whatsapp: "919000000000",
  email: "gotrip2626@gmail.com",
  address: "Greater Noida, Uttar Pradesh, India",
  hours: "9:00 AM - 9:00 PM, all days",
  service_areas: ["Greater Noida", "Greater Noida West", "Knowledge Park", "Pari Chowk", "Noida (selected sectors)", "Delhi NCR (on request)"],
  online_booking: false,
  online_payment: false,
};

export function useSiteConfig(): SiteConfig {
  const { data } = useQuery({ queryKey: ["site-config"], queryFn: api.siteConfig, staleTime: 10 * 60_000 });
  return data ?? FALLBACK_CONFIG;
}
