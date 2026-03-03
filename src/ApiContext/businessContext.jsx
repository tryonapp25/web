import React, { createContext, useEffect, useState } from "react";

export const BusinessContext = createContext(null);

export function BusinessProvider({ children }) {
  const [publicUser, setPublicUser] = useState(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [businessInfo, setBusinessInfo] = useState(null);
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);
 
  // keep sessionStorage in sync
  useEffect(() => {
    if (publicUser) {
      sessionStorage.setItem("user", JSON.stringify(publicUser));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [publicUser]);

  return (
    <BusinessContext.Provider value={{ businessInfo, setBusinessInfo, publicUser, setPublicUser, isBusinessOpen, setIsBusinessOpen }}>
      {children}
    </BusinessContext.Provider>
  );
}
