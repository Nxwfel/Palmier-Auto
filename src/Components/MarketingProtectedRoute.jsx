import { Navigate, Outlet } from "react-router-dom";

export default function MarketingProtectedRoute() {
  const token = localStorage.getItem("authToken");
  if (!token) return <Navigate to="/marketinglogin" replace />;
  return <Outlet />;
}
