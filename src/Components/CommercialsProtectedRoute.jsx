import { Navigate, Outlet } from "react-router-dom";

export default function CommercialsProtectedRoute() {
  const token = localStorage.getItem("authToken");
  if (!token) return <Navigate to="/commercialslogin" replace />;
  return <Outlet />;
}
