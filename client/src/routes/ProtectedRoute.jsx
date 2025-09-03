import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Chat from "../components/Chat";

const isAuthenticated = () => {
  return !!localStorage.getItem("userName"); // true if token exists
};

const PublicRoute = ({children}) => {
  const navigate = useNavigate();
  console.log("isAuthenticated()++++++++ :", isAuthenticated());
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/chat", { replace: true });
    }
    return children
  });
};

const ProtectedRoute = ({children}) => {
  const navigate = useNavigate();
  console.log("isAuthenticated() --------------:", isAuthenticated());

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/sign-in", { replace: true });
    }
    return children
  }, []);
};

// component
// const ProtectedRoute = () => {
//   const navigate = useNavigate();
//   const isAuthenticated = localStorage.getItem("userName") ? true : false; //add a dynamic method call
//   console.log('isAuthenticated :', isAuthenticated);

//   useEffect(() => {
//     if (isAuthenticated) {
//       return navigate("/", { replace: true });
//     }
//   }, [isAuthenticated, navigate]);

//   return (
//     <Chat>
//       <Outlet />
//     </Chat>
//   );
// };

export { ProtectedRoute, PublicRoute };
