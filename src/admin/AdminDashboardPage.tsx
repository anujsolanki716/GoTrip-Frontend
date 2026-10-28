import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CarFront, Handshake, Inbox, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { adminApi } from "@/lib/api";
import { formatDate, label } from "@/lib/format";
import { AdminPageHeader } from "./AdminLayout";
import { EnquiryStatusBadge } from "./EnquiryStatusBadge";

export function AdminDashboardPage() {
  useDocumentTitle("Admin dashboard");
  const stats = useQuery({ queryKey: ["admin", "stats"], queryFn: adminApi.stats });
  const latest = useQuery({ queryKey: ["admin", "enquiries", "latest"], queryFn: () => adminApi.enquiries({ page_size: 6 }) });
  const s = stats.data;
  const max = Math.max(1, ...(s?.last_14_days.map((d) => d.count) ?? [1]));

  const tiles = [
    { label: "New enquiries", value: s?.enquiries_new, icon: Inbox, to: "/admin/enquiries?status=new" },
    { label: "Enquiries (7 days)", value: s?.enquiries_last_7_days, icon: Sparkles, to: "/admin/enquiries" },
    { label: "Converted offline", value: s?.converted_offline, icon: Handshake, to: "/admin/enquiries?status=converted_offline" },
    { label: "Published cars", value: s ? `${s.cars_published} / ${s.cars_total}` : undefined, icon: CarFront, to: "/admin/cars" },
  ];

  return (
    <>
      <AdminPageHeader title="Dashboard" description="Overview of enquiries and fleet listings." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(({ label: l, value, icon: Icon, to }) => (
          <Link key={l} to={to} className="rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{l}</p>
              <Icon className="size-5 text-gold-600" aria-hidden />
            </div>
            {value === undefined ? <Skeleton className="mt-3 h-8 w-16" /> : <p className="mt-2 font-display text-3xl font-bold">{value}</p>}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Enquiries, last 14 days</CardTitle></CardHeader>
          <CardContent>
            <div className="flex h-40 items-end gap-1.5" role="img" aria-label="Bar chart of daily enquiries">
              {s?.last_14_days.map((d) => (
                <div key={d.day} className="group flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] text-muted opacity-0 group-hover:opacity-100">{d.count}</span>
                  <div className="w-full rounded-t-md bg-gold/80 transition group-hover:bg-gold" style={{ height: `${Math.max(4, (d.count / max) * 120)}px` }} title={`${d.day}: ${d.count}`} />
                  <span className="text-[10px] text-muted">{d.day.slice(8)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Most enquired cars</CardTitle></CardHeader>
          <CardContent>
            {s?.top_cars.length ? (
              <ol className="space-y-3">
                {s.top_cars.map((c, i) => (
                  <li key={c.car_id ?? i} className="flex items-center justify-between text-sm">
                    <span><span className="mr-2 text-muted">{i + 1}.</span>{c.name}</span>
                    <span className="font-semibold">{c.enquiries}</span>
                  </li>
                ))}
              </ol>
            ) : <p className="text-sm text-muted">No enquiries yet.</p>}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Latest enquiries</CardTitle>
          <Link to="/admin/enquiries" className="inline-flex items-center gap-1 text-sm font-medium hover:underline">View all <ArrowRight className="size-4" aria-hidden /></Link>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="text-left text-xs text-muted uppercase">
              <tr><th className="pb-2 font-medium">Customer</th><th className="pb-2 font-medium">Car</th><th className="pb-2 font-medium">Type</th><th className="pb-2 font-medium">Received</th><th className="pb-2 font-medium">Status</th></tr>
            </thead>
            <tbody>
              {latest.data?.items.map((e) => (
                <tr key={e.id} className="border-t border-line">
                  <td className="py-3"><Link className="font-medium hover:underline" to={`/admin/enquiries/${e.id}`}>{e.full_name}</Link><div className="text-xs text-muted">{e.reference}</div></td>
                  <td className="py-3">{e.car_name_snapshot ?? "General"}</td>
                  <td className="py-3">{label(e.customer_type)}</td>
                  <td className="py-3">{formatDate(e.created_at, true)}</td>
                  <td className="py-3"><EnquiryStatusBadge status={e.status} /></td>
                </tr>
              ))}
              {latest.data?.items.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-muted">No enquiries yet.</td></tr>}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}
