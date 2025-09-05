import React from "react";
import WelcomePage from "./WelcomePage";
import { Outlet } from "react-router-dom";

function BaseLayout() {
  return <Outlet />;
}

export default BaseLayout;