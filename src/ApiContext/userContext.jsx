import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [publicUser, setPublicUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // keep localStorage in sync
  useEffect(() => {
    if (publicUser) {
      localStorage.setItem("user", JSON.stringify(publicUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [publicUser]);

  return (
    <UserContext.Provider value={{ publicUser, setPublicUser }}>
      {children}
    </UserContext.Provider>
  );
}
