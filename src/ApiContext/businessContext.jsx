import React, { createContext, useEffect, useState } from "react";

export const BusinessContext = createContext(null);

export function BusinessProvider({ children }) {
  const [publicUser, setPublicUser] = useState(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [businessInfo, setBusinessInfo] = useState(null);
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
  const [isPOSEnabled, setIsPOSEnabled] = useState(false);
 
  // keep sessionStorage in sync
  useEffect(() => {
    if (publicUser) {
      localStorage.setItem("user", JSON.stringify(publicUser));
    };
  }, [publicUser]);

  return (
    <BusinessContext.Provider value={{ businessInfo, setBusinessInfo, publicUser, setPublicUser, isBusinessOpen, setIsBusinessOpen, isPOSEnabled, setIsPOSEnabled }}>
      {children}
    </BusinessContext.Provider>
  );
}
