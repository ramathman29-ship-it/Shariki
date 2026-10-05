import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "./routes";
import SiteLayout from "@/components/layout/SiteLayout";
import RequireAuth from "@/components/routing/RequireAuth";
import LegacyPropertyRedirect from "@/components/routing/LegacyPropertyRedirect";
import HomePage from "@/pages/public/HomePage";

// Code-split everything except the landing page
const PropertiesPage = lazy(() => import("@/pages/public/PropertiesPage"));
const PropertyDetailsPage = lazy(() => import("@/pages/public/PropertyDetailsPage"));
const AboutPage = lazy(() => import("@/pages/public/AboutPage"));
const AuthPage = lazy(() => import("@/pages/public/AuthPage"));
const NotFoundPage = lazy(() => import("@/pages/public/NotFoundPage"));
const ListPropertyPage = lazy(() => import("@/pages/account/ListPropertyPage"));
const MyRequestsPage = lazy(() => import("@/pages/account/MyRequestsPage"));
const MyPropertiesPage = lazy(() => import("@/pages/account/MyPropertiesPage"));
const ProfilePage = lazy(() => import("@/pages/account/ProfilePage"));
const AdminLayout = lazy(() => import("@/components/layout/AdminLayout"));
const AdminOverviewPage = lazy(() => import("@/pages/admin/AdminOverviewPage"));
const ListingApprovalsPage = lazy(() => import("@/pages/admin/ListingApprovalsPage"));
const ContractsPage = lazy(() => import("@/pages/admin/ContractsPage"));
const ReportsPage = lazy(() => import("@/pages/admin/ReportsPage"));

// Old URLs (bookmarks, notification links) → new ones
const redirect = (from, to) => ({ path: from, element: <Navigate to={to} replace /> });
const LEGACY = [
  redirect("/houses", ROUTES.properties),
  { path: "/houses/:id", element: <LegacyPropertyRedirect /> },
  redirect("/aboutus", ROUTES.about),
  redirect("/sellyourHouse", ROUTES.listProperty),
  redirect("/myRequests", ROUTES.account.requests),
  redirect("/host", ROUTES.account.properties),
  redirect("/useraccount", ROUTES.account.profile),
  redirect("/AdminDashbored", ROUTES.admin.root),
  redirect("/Admin", ROUTES.admin.contracts),
  redirect("/Admin2", ROUTES.admin.listings),
];

export const router = createBrowserRouter([
  { path: ROUTES.login, element: <AuthPage /> },
  {
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.properties, element: <PropertiesPage /> },
      { path: "/properties/:id", element: <PropertyDetailsPage /> },
      { path: ROUTES.about, element: <AboutPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: ROUTES.listProperty, element: <ListPropertyPage /> },
          { path: ROUTES.account.requests, element: <MyRequestsPage /> },
          { path: ROUTES.account.properties, element: <MyPropertiesPage /> },
          { path: ROUTES.account.profile, element: <ProfilePage /> },
        ],
      },
      ...LEGACY,
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    element: <RequireAuth admin />,
    children: [
      {
        path: ROUTES.admin.root,
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminOverviewPage /> },
          { path: ROUTES.admin.listings, element: <ListingApprovalsPage /> },
          { path: ROUTES.admin.contracts, element: <ContractsPage /> },
          { path: ROUTES.admin.reports, element: <ReportsPage /> },
        ],
      },
    ],
  },
]);
