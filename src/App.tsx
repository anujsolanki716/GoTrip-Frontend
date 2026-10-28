import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AboutPage } from "@/pages/AboutPage";
import { CarDetailPage } from "@/pages/CarDetailPage";
import { CarsPage } from "@/pages/CarsPage";
import { ContactPage } from "@/pages/ContactPage";
import { EnquirePage } from "@/pages/EnquirePage";
import { ErrorPage } from "@/pages/ErrorPage";
import { FaqPage } from "@/pages/FaqPage";
import { HomePage } from "@/pages/HomePage";
import { HowItWorksPage } from "@/pages/HowItWorksPage";
import { PrivacyPage, TermsPage } from "@/pages/LegalPages";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PoliciesPage } from "@/pages/PoliciesPage";

// The admin area is code-split so it never loads for regular visitors.
const AdminAccountPage = lazy(() => import("@/admin/AdminAccountPage").then((x) => ({ default: x.AdminAccountPage })));
const AdminCarFormPage = lazy(() => import("@/admin/AdminCarFormPage").then((x) => ({ default: x.AdminCarFormPage })));
const AdminCarsPage = lazy(() => import("@/admin/AdminCarsPage").then((x) => ({ default: x.AdminCarsPage })));
const AdminDashboardPage = lazy(() => import("@/admin/AdminDashboardPage").then((x) => ({ default: x.AdminDashboardPage })));
const AdminEnquiriesPage = lazy(() => import("@/admin/AdminEnquiriesPage").then((x) => ({ default: x.AdminEnquiriesPage })));
const AdminEnquiryDetailPage = lazy(() => import("@/admin/AdminEnquiryDetailPage").then((x) => ({ default: x.AdminEnquiryDetailPage })));
const AdminLayout = lazy(() => import("@/admin/AdminLayout").then((x) => ({ default: x.AdminLayout })));
const AdminLoginPage = lazy(() => import("@/admin/AdminLoginPage").then((x) => ({ default: x.AdminLoginPage })));
const RequireAdmin = lazy(() => import("@/admin/auth").then((x) => ({ default: x.RequireAdmin })));

const Lazy = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<div className="min-h-dvh bg-cloud" aria-busy="true" />}>{children}</Suspense>
);

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "cars", element: <CarsPage /> },
      { path: "cars/:slug", element: <CarDetailPage /> },
      { path: "enquire", element: <EnquirePage /> },
      { path: "how-it-works", element: <HowItWorksPage /> },
      { path: "policies", element: <PoliciesPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "faq", element: <FaqPage /> },
      { path: "privacy", element: <PrivacyPage /> },
      { path: "terms", element: <TermsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  { path: "/admin/login", element: <Lazy><AdminLoginPage /></Lazy> },
  {
    path: "/admin",
    errorElement: <ErrorPage />,
    element: (
      <Lazy>
        <RequireAdmin>
          <AdminLayout />
        </RequireAdmin>
      </Lazy>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "enquiries", element: <AdminEnquiriesPage /> },
      { path: "enquiries/:id", element: <AdminEnquiryDetailPage /> },
      { path: "cars", element: <AdminCarsPage /> },
      { path: "cars/new", element: <AdminCarFormPage /> },
      { path: "cars/:id", element: <AdminCarFormPage /> },
      { path: "account", element: <AdminAccountPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
