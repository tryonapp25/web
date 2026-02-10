import { Navigate, Outlet } from "react-router-dom";

export default function BusinessProtection() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (user?.role !== "business"){ 
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
