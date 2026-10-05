import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { PageLoader } from "@/components/ui/Skeleton";
import ScrollManager from "@/components/routing/ScrollManager";
import Header from "./Header";
import Footer from "./Footer";

export default function SiteLayout() {
  return (
    <>
      <ScrollManager />
      <Header />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
