import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function NotFoundPage({ message = "The page you're looking for doesn't exist." }: { message?: string }) {
  useDocumentTitle("Page not found");
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl font-extrabold text-gold">404</p>
      <h1 className="mt-4 text-2xl font-bold">Wrong turn</h1>
      <p className="mt-2 text-muted">{message}</p>
      <div className="mt-8 flex gap-3">
        <Button asChild><Link to="/cars">Browse cars</Link></Button>
        <Button asChild variant="outline"><Link to="/">Go home</Link></Button>
      </div>
    </div>
  );
}
