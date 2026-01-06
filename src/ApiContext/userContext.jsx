import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [publicUser, setPublicUser] = useState(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // keep sessionStorage in sync
  useEffect(() => {
    if (publicUser) {
      sessionStorage.setItem("user", JSON.stringify(publicUser));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [publicUser]);

  return (
    <UserContext.Provider value={{ publicUser, setPublicUser }}>
      {children}
    </UserContext.Provider>
  );
}
