import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { ApiError, adminApi } from "@/lib/api";
import { BRAND } from "@/lib/brand";
import { useAdmin } from "./auth";

const schema = z.object({ email: z.email("Enter your email"), password: z.string().min(1, "Enter your password") });
type Values = z.infer<typeof schema>;

export function AdminLoginPage() {
  useDocumentTitle("Admin sign in");
  const me = useAdmin();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });

  if (me.data) return <Navigate to="/admin" replace />;

  const onSubmit = async (v: Values) => {
    setError(null);
    try {
      const res = await adminApi.login(v.email, v.password);
      qc.setQueryData(["admin-me"], res.admin);
      navigate((location.state as { from?: string } | null)?.from ?? "/admin", { replace: true });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not sign in. Please try again.");
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cloud p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <div className="rounded-2xl bg-ink px-5 py-3"><img src={BRAND.logo} alt="GoTrip" className="h-10" /></div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-sm">
          <h1 className="flex items-center gap-2 text-xl font-bold"><Lock className="size-5 text-gold-600" aria-hidden /> Staff sign in</h1>
          <Field id="email" label="Email" error={errors.email?.message}>
            <Input type="email" autoComplete="username" {...register("email")} />
          </Field>
          <Field id="password" label="Password" error={errors.password?.message}>
            <Input type="password" autoComplete="current-password" {...register("password")} />
          </Field>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" aria-hidden />} Sign in
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-muted">Authorised GoTrip staff only.</p>
      </div>
    </div>
  );
}
