import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
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

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <AuthContextProvider>
          <SocketContextProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </SocketContextProvider>
        </AuthContextProvider>
    </ThemeProvider>
  </>
);
