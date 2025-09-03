import { useState } from "react";
import { AuthContext } from "./AuthContext";

export const AuthContextProvider = ({ children }) => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const value = userId && userName ? {userId, userName} : null;
	const [authUser, setAuthUser] = useState(value);

	return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};