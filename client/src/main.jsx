import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { DBProvider } from "./context/DBProvider.jsx";
import { SocketContextProvider } from "./context/SocketProvider.jsx";
import { AuthContextProvider } from "./context/AuthProvider.jsx";

const theme = createTheme({
  typography: {
    fontFamily: "'Figtree', sans-serif",
    fontOpticalSizing: "auto",
    fontWeight: 400,
    fontStyle: "normal",
  },
});

createRoot(document.getElementById("root")).render(
  <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DBProvider>
        <AuthContextProvider>
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </AuthContextProvider>
      </DBProvider>
    </ThemeProvider>
  </>
);
