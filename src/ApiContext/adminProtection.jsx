import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtection() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (user?.role !== "admin"){ 
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
