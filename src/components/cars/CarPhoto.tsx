import { useState } from "react";
import { mediaUrl } from "@/lib/api";
import type { Car } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CarIllustration } from "./CarIllustration";

export function CarPhoto({ car, className, eager = false }: { car: Car; className?: string; eager?: boolean }) {
  const image = car.images[0];
  const [failed, setFailed] = useState(false);
  if (!image || failed) return <CarIllustration category={car.category} className={className} />;
  return (
    <img
      src={mediaUrl(image.url)}
      alt={image.alt_text ?? car.name}
      width={image.width ?? undefined}
      height={image.height ?? undefined}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
