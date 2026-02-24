import { Navigate, Outlet } from "react-router-dom";

export default function BusinessProtection() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (!user?.isCustomer){ 
    return <Navigate to="/business/payment" replace />;
  }

  return <Outlet />;
}
