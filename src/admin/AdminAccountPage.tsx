import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { adminApi } from "@/lib/api";
import { AdminPageHeader } from "./AdminLayout";
import { useAdmin } from "./auth";

export function AdminAccountPage() {
  useDocumentTitle("Account");
  const { data: admin } = useAdmin();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) return setMsg({ ok: false, text: "New passwords do not match." });
    setBusy(true);
    try {
      await adminApi.changePassword(current, next);
      setMsg({ ok: true, text: "Password changed. Other sessions have been signed out." });
      setCurrent(""); setNext(""); setConfirm("");
    } catch (err) {
      setMsg({ ok: false, text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminPageHeader title="Account" description={`${admin?.full_name} · ${admin?.email} · ${admin?.role}`} />
      <Card className="max-w-lg">
        <CardHeader><CardTitle>Change password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Field id="current" label="Current password"><Input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required /></Field>
            <Field id="new" label="New password" hint="At least 12 characters, using three of: lowercase, uppercase, digits, symbols."><Input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} minLength={12} required /></Field>
            <Field id="confirm" label="Confirm new password"><Input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></Field>
            {msg && <p role="alert" className={msg.ok ? "text-sm text-emerald-700" : "text-sm text-red-700"}>{msg.text}</p>}
            <Button type="submit" disabled={busy}>Update password</Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
