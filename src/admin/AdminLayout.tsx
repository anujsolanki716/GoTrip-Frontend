import { CarFront, Inbox, LayoutDashboard, LogOut, Menu, UserCog, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { useAdmin, useLogout } from "./auth";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { to: "/admin/cars", label: "Cars", icon: CarFront },
  { to: "/admin/account", label: "Account", icon: UserCog },
];

export function AdminLayout() {
  const { data: admin } = useAdmin();
  const logout = useLogout();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Admin">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-cloud hover:text-ink",
              isActive && "bg-ink text-white hover:bg-ink hover:text-white")
          }
        >
          <Icon className="size-4" aria-hidden /> {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-cloud">
      <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 border-r border-line bg-white p-4 transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <Link to="/admin" className="mb-8 flex items-center gap-3 px-2">
          <img src={BRAND.logoMark} alt="" className="size-9" />
          <span className="font-display text-lg font-bold">GoTrip <span className="text-sm font-medium text-muted">Admin</span></span>
        </Link>
        {nav}
        <div className="absolute inset-x-4 bottom-4 space-y-2">
          <a href="/" target="_blank" rel="noopener" className="flex items-center gap-2 px-3 text-xs text-muted hover:text-ink"><ExternalLink className="size-3.5" aria-hidden /> View website</a>
          <div className="rounded-xl bg-cloud p-3 text-xs">
            <p className="truncate font-semibold">{admin?.full_name}</p>
            <p className="truncate text-muted">{admin?.email} · {admin?.role}</p>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={logout}><LogOut aria-hidden /> Sign out</Button>
        </div>
      </aside>
      {open && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="size-5" /></Button>
          <span className="font-display font-bold">GoTrip Admin</span>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
