import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import useAuth from "@/hooks/useAuth";
import { PageLoader } from "@/components/ui/Skeleton";

/**
 * Route guard. Sends guests to /login (remembering where they were going);
 * with `admin`, also requires an admin account.
 */
export default function RequireAuth({ admin = false }) {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.login} state={{ from: location.pathname + location.search }} replace />;
  }
  if (admin && loading) return <PageLoader />;
  if (admin && !isAdmin) return <Navigate to={ROUTES.home} replace />;

  return <Outlet />;
}
