import { useState, useEffect } from "react";
import { initDB } from "../services/indexdb";
import { Box, LinearProgress } from "@mui/material";
import { DBContext } from "./DBContext";

export const DBProvider = ({ children }) => {
  const [db, setDb] = useState(null);

  useEffect(() => {
      (async () => {
        setDb(await initDB());
      })();
  }, []);

  if (!db)
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress color="primary" />
      </Box>
    ) 

  return <DBContext.Provider value={db}>{children}</DBContext.Provider>;
};
