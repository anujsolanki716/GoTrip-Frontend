import type { CarCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

// Stylised placeholder shown until real photos are uploaded in the admin panel.
const SHAPES: Record<CarCategory, string> = {
  hatchback: "M30 118c2-20 18-28 44-31l38-27c12-8 26-11 46-11 30 0 48 4 66 22l24 20c22 3 32 12 32 30v16H30Z",
  sedan: "M18 120c2-18 16-26 42-29l42-28c14-8 30-11 52-11 30 0 46 6 62 24l20 14 38 6c16 3 22 12 22 26v12H18Z",
  compact_suv: "M24 120V98c0-12 10-18 34-20l30-30c10-9 24-12 50-12h54c24 0 36 6 50 22l18 20c26 2 38 10 38 26v16H24Z",
  suv: "M18 120V94c0-12 10-18 32-20l26-32c8-9 20-12 46-12h76c22 0 34 6 46 20l20 24c30 2 42 10 42 28v18H18Z",
  muv: "M14 120V92c0-12 8-18 26-20l30-34c8-8 18-10 40-10h110c20 0 30 4 42 18l24 26c22 2 30 10 30 26v22H14Z",
  premium: "M16 122c2-16 16-24 46-28l46-26c16-9 34-12 58-12 32 0 50 8 66 24l22 12c34 4 46 12 46 30H16Z",
};

export function CarIllustration({ category, className }: { category: CarCategory; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-ink-700 via-ink to-ink",
        className,
      )}
      role="img"
      aria-label="Photo coming soon"
    >
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(233,185,73,0.22),transparent_60%)]" />
      <svg viewBox="0 0 340 160" className="relative w-4/5 max-w-sm drop-shadow-2xl" aria-hidden>
        <ellipse cx="170" cy="140" rx="150" ry="9" fill="#000" opacity=".5" />
        <path d={SHAPES[category]} fill="#2A2E35" stroke="#3B4048" strokeWidth="2" />
        <path d="M40 112h270" stroke="#E9B949" strokeWidth="2.5" opacity=".85" />
        <circle cx="90" cy="134" r="20" fill="#0B0D10" stroke="#3B4048" strokeWidth="6" />
        <circle cx="90" cy="134" r="7" fill="#E9B949" />
        <circle cx="258" cy="134" r="20" fill="#0B0D10" stroke="#3B4048" strokeWidth="6" />
        <circle cx="258" cy="134" r="7" fill="#E9B949" />
      </svg>
      <span className="absolute bottom-3 left-3 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/70 backdrop-blur">
        Photo coming soon
      </span>
    </div>
  );
}
