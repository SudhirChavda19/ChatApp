import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { SocketContextProvider } from "./context/SocketProvider.jsx";
import { AuthContextProvider } from "./context/AuthProvider.jsx";
import { NetworkProvider } from "./context/NetworkProvider.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { grey } from "@mui/material/colors";

const theme = createTheme({
  typography: {
    fontFamily: "'Figtree', sans-serif",
    fontOpticalSizing: "auto",
    fontWeight: 400,
    fontStyle: "normal",
  },
  palette: {
    grey: {
      light1: grey[300],
      light2: grey[400],
      main: grey[500],
      dark: grey[700],
      darker1: grey[800],
      darker2: grey[900],
    },
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NetworkProvider>
        <AuthContextProvider>
          <SocketContextProvider>
            <QueryClientProvider client={queryClient}>
              <Provider store={store}>
                <App />
              </Provider>
            </QueryClientProvider>
          </SocketContextProvider>
        </AuthContextProvider>
      </NetworkProvider>
    </ThemeProvider>
  </>
);
