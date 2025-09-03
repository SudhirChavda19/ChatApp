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
import { PublicRoute, ProtectedRoute } from "./ProtectedRoute";
import NotFound from "../components/NotFound";
import WelcomePage from "../components/WelcomePage";
import BaseLayout from "../components/BaseLayout";

function AllRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Outlet />}> */}
        <Route path="/" element={<BaseLayout />}>
          {/* <Route element={<WelcomePage />}> */}
            <Route index element={<Navigate to="/sign-in" replace />} />
            <Route path="sign-in" element={<SignIn />}></Route>
            {/* <Route element={<ProtectedRoute />}> */}
            <Route path="chat" element={<Chat />}>
              {/* <Route element={<Outlet />}> */}
              <Route index element={<NoUserFallback />} />
              <Route path="user/:id" element={<ChatBox />} />
              {/* </Route> */}
              {/* </Route> */}
            </Route>
            
          {/* </Route> */}
          <Route path="*" element={<NotFound />} />
        </Route>
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default AllRoutes;
