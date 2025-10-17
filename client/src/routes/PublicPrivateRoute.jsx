import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";


const PublicRoute = () => {
  const { authUser } = useAuthContext();
  return authUser ? <Navigate to="/chat" /> : <Outlet />;
};

const ProtectedRoute = () => {
  const { authUser } = useAuthContext();
  return authUser ? <Outlet /> : <Navigate to="/sign-in" />;
};

export { ProtectedRoute, PublicRoute };
