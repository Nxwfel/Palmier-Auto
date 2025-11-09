import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("authToken");
  // Optional: validate token expiration if stored (e.g., decode JWT)
  if (!token) {
    return <Navigate to="/adminlogin" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;