import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // إذا ما في توكن، رجع المستخدم على صفحة login مع تخزين الصفحة الأصلية
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
