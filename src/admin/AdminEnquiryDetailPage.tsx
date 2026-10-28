import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Info, Loader2, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { WhatsAppIcon } from "@/components/layout/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, Textarea } from "@/components/ui/input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { adminApi } from "@/lib/api";
import { formatDate, label, telLink, waLink } from "@/lib/format";
import type { EnquiryStatus } from "@/lib/types";
import { AdminPageHeader } from "./AdminLayout";
import { ENQUIRY_STATUSES, EnquiryStatusBadge } from "./EnquiryStatusBadge";

export function AdminEnquiryDetailPage() {
  const id = Number(useParams().id);
  const qc = useQueryClient();
  const { data: e, isLoading } = useQuery({ queryKey: ["admin", "enquiry", id], queryFn: () => adminApi.enquiry(id) });
  useDocumentTitle(e ? `Enquiry ${e.reference}` : "Enquiry");
  const [status, setStatus] = useState<EnquiryStatus>("new");
  const [notes, setNotes] = useState("");
  useEffect(() => {
    if (e) { setStatus(e.status); setNotes(e.admin_notes ?? ""); }
  }, [e]);

  const save = useMutation({
    mutationFn: () => adminApi.updateEnquiry(id, { status, admin_notes: notes }),
    onSuccess: (updated) => {
      qc.setQueryData(["admin", "enquiry", id], updated);
      qc.invalidateQueries({ queryKey: ["admin", "enquiries"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });

  if (isLoading || !e) return <p className="text-muted">Loading…</p>;
  const dirty = status !== e.status || notes !== (e.admin_notes ?? "");
  const first = e.full_name.split(" ")[0];
  const waText = `Hi ${first}, this is GoTrip regarding your enquiry ${e.reference}${e.car_name_snapshot ? ` for the ${e.car_name_snapshot}` : ""}.`;
  const rows: [string, React.ReactNode][] = [
    ["Reference", e.reference],
    ["Car", e.car ? <Link className="underline" to={`/admin/cars/${e.car.id}`}>{e.car.name}</Link> : e.car_name_snapshot ?? "General enquiry"],
    ["Customer type", label(e.customer_type)],
    ["Preferred contact", label(e.preferred_contact)],
    ["Phone", e.phone],
    ["Email", e.email ?? "—"],
    ["Pickup date", formatDate(e.pickup_date)],
    ["Return date", formatDate(e.return_date)],
    ["Pickup area", e.pickup_area ?? "—"],
    ["Received", formatDate(e.created_at, true)],
    ["First contacted", formatDate(e.contacted_at, true)],
    ["Source", e.source ?? "—"],
  ];

  return (
    <>
      <Link to="/admin/enquiries" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><ChevronLeft className="size-4" aria-hidden /> Enquiries</Link>
      <AdminPageHeader
        title={e.full_name}
        description={`Enquiry ${e.reference}`}
        actions={
          <>
            <Button asChild variant="whatsapp" size="sm"><a href={waLink(e.phone, waText)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="size-4" /> WhatsApp</a></Button>
            <Button asChild variant="dark" size="sm"><a href={telLink(e.phone)}><Phone aria-hidden /> Call</a></Button>
            {e.email && <Button asChild variant="outline" size="sm"><a href={`mailto:${e.email}?subject=${encodeURIComponent(`Your GoTrip enquiry ${e.reference}`)}`}><Mail aria-hidden /> Email</a></Button>}
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="flex-row items-center justify-between"><CardTitle>Details</CardTitle><EnquiryStatusBadge status={e.status} /></CardHeader>
          <CardContent>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {rows.map(([k, v]) => (
                <div key={k}><dt className="text-xs text-muted">{k}</dt><dd className="mt-0.5 text-sm font-medium break-words">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-6">
              <p className="text-xs text-muted">Message</p>
              <p className="mt-1 rounded-xl bg-cloud p-4 text-sm whitespace-pre-line">{e.message || "—"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="self-start">
          <CardHeader><CardTitle>Follow-up</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Status</span>
              <Select value={status} onChange={(ev) => setStatus(ev.target.value as EnquiryStatus)}>
                {ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
              </Select>
            </label>
            {status === "converted_offline" && (
              <p className="flex gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                <Info className="size-4 shrink-0" aria-hidden />
                Use this when the customer has completed verification, signed the agreement and paid offline. The website does not record payments or reservations.
              </p>
            )}
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Internal notes</span>
              <Textarea rows={6} value={notes} maxLength={5000} onChange={(ev) => setNotes(ev.target.value)} placeholder="Call summary, documents seen, quoted price…" />
            </label>
            {save.isError && <p role="alert" className="text-sm text-red-700">{(save.error as Error).message}</p>}
            {save.isSuccess && !dirty && <p role="status" className="text-sm text-emerald-700">Saved.</p>}
            <Button className="w-full" disabled={!dirty || save.isPending} onClick={() => save.mutate()}>
              {save.isPending && <Loader2 className="animate-spin" aria-hidden />} Save changes
            </Button>
            {e.converted_at && <p className="text-xs text-muted">Marked converted offline on {formatDate(e.converted_at, true)}.</p>}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
