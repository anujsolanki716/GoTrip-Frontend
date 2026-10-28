import { useSiteConfig } from "@/hooks/useSiteConfig";
import { waLink } from "@/lib/format";

export function WhatsAppIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

export function WhatsAppFab() {
  const c = useSiteConfig();
  return (
    <a
      href={waLink(c.whatsapp, "Hi GoTrip, I'd like to know more about your self-drive cars.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with GoTrip on WhatsApp"
      className="fixed right-4 bottom-4 z-30 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
