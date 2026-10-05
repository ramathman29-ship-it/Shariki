import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "@/context/AuthProvider";
import ToastProvider from "@/context/ToastProvider";
import { PageLoader } from "@/components/ui/Skeleton";
import { router } from "./router";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </ToastProvider>
  );
}
