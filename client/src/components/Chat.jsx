import { Outlet } from "react-router-dom";
import { Card, Divider } from "@mui/material";
import SideBar from "./SideBar";
import { useNetworkContext } from "../context/NetworkContext";
import OfflinePage from "./common/OfflinePage";

function Chat() {
  const { isOnline } = useNetworkContext();

  return (
    <>
      <Card sx={{ height: "86vh", display: "flex", flexDirection: "row" }}>
        {!isOnline &&
        performance.getEntriesByType("navigation")[0].type === "reload" ? (
          <OfflinePage />
        ) : (
          <>
            <SideBar />
            <Divider orientation="vertical" flexItem />
            <Outlet />
          </>
        )}
      </Card>
    </>
  );
}

export default Chat;
