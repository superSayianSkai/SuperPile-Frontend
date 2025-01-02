import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";
import SuperPileProvider from "./context/SuperPileProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SuperPileProvider>
      <App />
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
    </SuperPileProvider>
  </StrictMode>
);
