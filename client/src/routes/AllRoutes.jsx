import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Chat from "../components/Chat";
import SignIn from "../components/SignIn";
import ChatBox from "../components/ChatBox";
import NoUserFallback from "../components/NoUserFallBack";
import { PublicRoute, ProtectedRoute } from "./PublicPrivateRoute";
import NotFound from "../components/NotFound";
import WelcomePage from "../components/WelcomePage";
import BaseLayout from "../components/BaseLayout";

function AllRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<WelcomePage />}>
            <Route element={<PublicRoute />}>
              <Route index element={<Navigate to="/sign-in" replace />} />
              <Route path="sign-in" element={<SignIn />}></Route>
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="chat" element={<Chat />}>
                <Route index element={<NoUserFallback />} />
                <Route path="user/:id" element={<ChatBox />} />
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
