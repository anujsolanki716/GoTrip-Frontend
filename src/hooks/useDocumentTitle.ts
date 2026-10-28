import { useEffect } from "react";

export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | GoTrip Self-Drive Car Rental` : "GoTrip — Self-Drive Car Rental in Greater Noida | NCR";
    if (description) document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [title, description]);
}
