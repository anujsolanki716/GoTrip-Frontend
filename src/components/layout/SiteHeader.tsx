import { Menu, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { telLink } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export const NAV = [
  { to: "/cars", label: "Our Cars" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/policies", label: "Rental Policies" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const config = useSiteConfig();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        scrolled ? "border-white/10 bg-ink/95 backdrop-blur" : "border-transparent bg-ink",
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-gold focus:px-3 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-20">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-white/75 transition hover:text-white",
                  isActive && "text-gold hover:text-gold",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={telLink(config.phone)} className="hidden items-center gap-2 text-sm font-medium text-white/80 hover:text-white md:inline-flex">
            <Phone className="size-4 text-gold" aria-hidden /> {config.phone}
          </a>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/enquire">Enquire Now</Link>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outlineLight" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent side="right" className="bg-ink p-6 text-white">
              <DialogTitle className="sr-only">Menu</DialogTitle>
              <DialogDescription className="sr-only">Site navigation</DialogDescription>
              <Logo />
              <nav aria-label="Mobile" className="mt-8 flex flex-col gap-1">
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn("rounded-xl px-3 py-3 text-base font-medium text-white/80 hover:bg-white/5", isActive && "text-gold")
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-3">
                <Button asChild size="lg">
                  <Link to="/enquire">Enquire Now</Link>
                </Button>
                <Button asChild variant="outlineLight" size="lg">
                  <a href={telLink(config.phone)}>
                    <Phone aria-hidden /> Call {config.phone}
                  </a>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
