import { Navigate, useParams } from "react-router-dom";
import { ROUTES } from "@/app/routes";

/** /houses/:id (old URL) → /properties/:id */
export default function LegacyPropertyRedirect() {
  const { id } = useParams();
  return <Navigate to={ROUTES.property(id)} replace />;
}
