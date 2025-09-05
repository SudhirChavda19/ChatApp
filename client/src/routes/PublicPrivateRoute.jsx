import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";


const PublicRoute = () => {
  const { authUser } = useAuthContext();
  console.log('authUser :', authUser);
  return authUser && authUser.userId ? <Navigate to="/chat" /> : <Outlet />;
};

const ProtectedRoute = () => {
  const { authUser } = useAuthContext();
  console.log('authUser :', authUser);
  return authUser && authUser.userId ? <Outlet /> : <Navigate to="/sign-in" />;
};

export { ProtectedRoute, PublicRoute };
