import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import StateProvider from "./context/StateProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient({});
import { register } from "./utils/serviceWorkerRegistration.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StateProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          {/* <ReactQueryDevtools initialIsOpen={false} position="" /> */}
        </QueryClientProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={1000}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </AuthProvider>
    </StateProvider>
  </StrictMode>
);

// Register service worker
register();
