import { useState } from "react";
import { AuthContext } from "./AuthContext";

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(false);

  const userId = localStorage.getItem("userId");
  const expirationTime = localStorage.getItem("userTokenExpiration");
  if (!userId || !expirationTime || new Date(expirationTime) < new Date()) {
    localStorage.removeItem("userId");
    localStorage.removeItem("userTokenExpiration");
    if(authUser) setAuthUser(false);
  } else {
    if(!authUser) setAuthUser(true);
  }

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
