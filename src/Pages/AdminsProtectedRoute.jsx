import { Navigate, Outlet } from "react-router-dom";

export default function AdminsProtectedRoute() {
  const token = localStorage.getItem("authToken");

  if (!token) return <Navigate to="/adminslogin" replace />;

  return <Outlet />;
}