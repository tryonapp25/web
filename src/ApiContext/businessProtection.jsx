import { Navigate, Outlet } from "react-router-dom";
import { BusinessProvider } from "./businessContext";
import { useContext, useRef, useEffect } from "react";
import { SocketContext } from "./socketContext";
import {UserContext} from "./userContext";
import handleBusinessSocketConnection from "../business/connection";

export default function BusinessProtection() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const {publicUser} = useContext(UserContext);
  const { connected, setSocketEnabled, connectBusiness } = useContext(SocketContext);
  const connectingRef = useRef(false);

  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (!user?.isCustomer){ 
    return <Navigate to="/business/payment" replace />;
  }

  useEffect(() => {
    if (publicUser && publicUser.isCustomer && !connected) {
      handleBusinessSocketConnection({
        publicUser,
        setSocketEnabled,
        connectBusiness,
        connectingRef,
      });
    }
  }, [publicUser, connected, setSocketEnabled, connectBusiness]);

  return (
    <BusinessProvider>
      <Outlet />
    </BusinessProvider>
  );
}
