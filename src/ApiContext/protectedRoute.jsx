import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const [user, setUser] = useState(undefined);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      setUser(parsedUser);
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}