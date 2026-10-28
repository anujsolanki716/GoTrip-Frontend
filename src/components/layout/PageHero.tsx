import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(233,185,73,0.18),transparent_55%)]" />
      <div className="container-page relative py-14 sm:py-20">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="max-w-3xl text-3xl font-bold sm:text-5xl">{title}</h1>
        {children && <div className="mt-4 max-w-2xl text-base text-white/70 sm:text-lg">{children}</div>}
      </div>
    </section>
  );
}
