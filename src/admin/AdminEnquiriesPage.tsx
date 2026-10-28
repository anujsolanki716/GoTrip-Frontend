import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { adminApi } from "@/lib/api";
import { formatDate, label } from "@/lib/format";
import { AdminPageHeader } from "./AdminLayout";
import { ENQUIRY_STATUSES, EnquiryStatusBadge } from "./EnquiryStatusBadge";

export function AdminEnquiriesPage() {
  useDocumentTitle("Enquiries");
  const [params, setParams] = useSearchParams();
  const query = {
    status: params.getAll("status"),
    q: params.get("q") ?? undefined,
    date_from: params.get("date_from") ?? undefined,
    date_to: params.get("date_to") ?? undefined,
    page: Number(params.get("page") ?? 1),
    page_size: 10,
  };
  const list = useQuery({ queryKey: ["admin", "enquiries", params.toString()], queryFn: () => adminApi.enquiries(query), placeholderData: keepPreviousData });
  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next, { replace: true });
  };

  return (
    <>
      <AdminPageHeader
        title="Enquiries"
        description="Customer enquiries. An enquiry is not a booking; rentals are arranged offline."
        actions={<Button asChild variant="outline" size="sm"><a href={adminApi.exportUrl({ ...query, page: undefined, page_size: undefined })}><Download aria-hidden /> Export CSV</a></Button>}
      />
      <div className="mb-4 grid gap-3 rounded-2xl border border-line bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm"><span className="mb-1 block text-xs text-muted">Search</span>
          <Input type="search" placeholder="Name, phone, reference, car" defaultValue={query.q} onChange={(e) => set("q", e.target.value.trim())} />
        </label>
        <label className="text-sm"><span className="mb-1 block text-xs text-muted">Status</span>
          <Select value={query.status[0] ?? ""} onChange={(e) => set("status", e.target.value)}>
            <option value="">All (excluding spam)</option>
            {ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
          </Select>
        </label>
        <label className="text-sm"><span className="mb-1 block text-xs text-muted">From</span>
          <Input type="date" value={query.date_from ?? ""} onChange={(e) => set("date_from", e.target.value)} />
        </label>
        <label className="text-sm"><span className="mb-1 block text-xs text-muted">To</span>
          <Input type="date" value={query.date_to ?? ""} onChange={(e) => set("date_to", e.target.value)} />
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-cloud/70 text-left text-xs text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Car</th>
              <th className="px-4 py-3 font-medium">Dates</th>
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.data?.items.map((e) => (
              <tr key={e.id} className="border-t border-line hover:bg-cloud/40">
                <td className="px-4 py-3">
                  <Link to={`/admin/enquiries/${e.id}`} className="font-medium hover:underline">{e.full_name}</Link>
                  <div className="text-xs text-muted">{e.reference} · {label(e.customer_type)}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{e.phone}</td>
                <td className="px-4 py-3">{e.car_name_snapshot ?? <span className="text-muted">General</span>}</td>
                <td className="px-4 py-3 whitespace-nowrap">{e.pickup_date ? `${formatDate(e.pickup_date)}${e.return_date ? ` – ${formatDate(e.return_date)}` : ""}` : "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(e.created_at, true)}</td>
                <td className="px-4 py-3"><EnquiryStatusBadge status={e.status} /></td>
              </tr>
            ))}
            {list.data?.items.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted">No enquiries match these filters.</td></tr>}
            {list.isLoading && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted">Loading…</td></tr>}
          </tbody>
        </table>
      </div>
      {list.data && list.data.pages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-3 text-sm">
          <span className="text-muted">{list.data.total} enquiries</span>
          <Button variant="outline" size="sm" disabled={query.page <= 1} onClick={() => set("page", String(query.page - 1))}><ChevronLeft aria-hidden /> Prev</Button>
          <span>{query.page} / {list.data.pages}</span>
          <Button variant="outline" size="sm" disabled={query.page >= list.data.pages} onClick={() => set("page", String(query.page + 1))}>Next <ChevronRight aria-hidden /></Button>
        </div>
      )}
    </>
  );
}
