import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import StateProvider from "./context/StateProvider.jsx";
import { QueryClient, QueryClientProvider} from "@tanstack/react-query";
// import { persistQueryClient } from '@tanstack/react-query-persist-client'
// import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({

})



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
