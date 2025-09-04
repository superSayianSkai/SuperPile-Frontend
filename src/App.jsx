import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import ArchivedPage from "./pages/ArchivedPage";
import PublicPile from "./pages/PublicPile";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HeroPublicPile from "./components/HeroPublicPile";
// import OnBoarding from "./pages/OnBoarding";
import ServiceWorkerToast from "./components/ServiceWorker";
import Login from "./components/Login";
import Layout from "./Layout/Layout";
import PrivacyPolicy from "./components/PrivacyPolicy";
// import BadgeDownloader from "./components/BadgeDownloader";
import Updates from "./pages/Updates";
import ShareHandler from "./pages/ShareHandler";
import ProtectedRoute from "./pages/ProtectedRoute";
import OfflineSnackbar from "./components/useOfflineSnackBar";
import {HelmetProvider } from 'react-helmet-async';
const App = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
        },
        { path: "/login", element: <Login /> },
        {
          path: "/archived",
          element: (
            <ProtectedRoute>
              <ArchivedPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/share",
          element: (
            <ProtectedRoute>
              <ShareHandler />
            </ProtectedRoute>
          ),
        },
        {
          path: "/api/share/:publicLinkToken",
          element: (
            <div>
              <HeroPublicPile />
              <PublicPile />
            </div>
          ),
        },
      ],
    },
    { path: "/extension-privacy", element: <PrivacyPolicy /> },
    { path: "/updates", element: <Updates /> },
    { path: "*", element: <NotFound /> },
  ]);

  return (
    <HelmetProvider>
      <OfflineSnackbar />
      <ServiceWorkerToast />
      <RouterProvider router={router} />
    </HelmetProvider>
  );
};

export default App;
