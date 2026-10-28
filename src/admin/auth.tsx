import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { ApiError, adminApi } from "@/lib/api";

export function useAdmin() {
  return useQuery({
    queryKey: ["admin-me"],
    queryFn: adminApi.me,
    retry: (n, e) => !(e instanceof ApiError && e.status === 401) && n < 1,
    staleTime: 60_000,
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return async () => {
    await adminApi.logout().catch(() => undefined);
    qc.clear();
    window.location.assign("/admin/login");
  };
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const me = useAdmin();
  const location = useLocation();
  if (me.isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-cloud" aria-busy="true">
        <Loader2 className="size-8 animate-spin text-gold" aria-label="Loading" />
      </div>
    );
  }
  if (!me.data) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}
