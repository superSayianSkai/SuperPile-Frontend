import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import ArchivedPage from "./pages/ArchivedPage";
import PublicPile from "./pages/PublicPile";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HeroPublicPile from "./components/HeroPublicPile";
import OnBoarding from "./pages/OnBoarding";
import Login from "./components/Login";
import Layout from "./Layout/Layout";
import BadgeDownloader from "./components/BadgeDownloader";
const App = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "*", element: <NotFound /> },
        { path: "/", element: <HomePage /> },
        { path: "/login", element: <Login /> },
        { path: "/onBoarding", element: <OnBoarding /> },
        { path: "/archived", element: <ArchivedPage /> },
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
    {
      path: "/badgeDownLoader",
      element: <BadgeDownloader />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
