import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Chat from "../components/Chat";
import NoUserFallback from "../components/NoUserFallBack";
import { PublicRoute, ProtectedRoute } from "./PublicPrivateRoute";
import NotFound from "../components/NotFound";
import WelcomePage from "../components/WelcomePage";
import BaseLayout from "../components/BaseLayout";
import SignIn from "../components/pages/SignIn";
import ForgotPassword from "../components/pages/ForgotPassword";
import SignUp from "../components/pages/SignUp";
import ChatBoxWrapper from "../components/ChatBoxWrapper";

function AllRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<WelcomePage />}>
            <Route element={<PublicRoute />}>
              <Route index element={<Navigate to="/sign-in" replace />} />
              <Route path="sign-in" element={<SignIn />}></Route>
              <Route path="sign-up" element={<SignUp />}></Route>
              <Route path="forgot-password" element={<ForgotPassword />}></Route>
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="chat" element={<Chat />}>
                <Route index element={<NoUserFallback />} />
                <Route path="room/:id" element={<ChatBoxWrapper />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AllRoutes;
