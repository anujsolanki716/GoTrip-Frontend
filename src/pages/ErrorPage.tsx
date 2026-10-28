import { Link } from "react-router";

/** Fallback shown if a page crashes, so visitors still see a way forward. */
export function ErrorPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-ink px-4 text-center text-white">
      <p className="font-display text-5xl font-extrabold text-gold">Oops</p>
      <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-white/70">Please refresh the page, or contact us on WhatsApp or phone.</p>
      <Link to="/" className="mt-8 rounded-xl bg-gold px-5 py-3 font-semibold text-ink" reloadDocument>Back to home</Link>
    </div>
  );
}
