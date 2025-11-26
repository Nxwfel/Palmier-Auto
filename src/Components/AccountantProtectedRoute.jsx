import { Navigate, Outlet } from "react-router-dom";

export default function AccountantProtectedRoute() {
  const token = localStorage.getItem("authToken");
  if (!token) return <Navigate to="/accountantlogin" replace />;
  return <Outlet />;
}
