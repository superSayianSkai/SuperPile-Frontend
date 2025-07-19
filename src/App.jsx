import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import ArchivedPage from "./pages/ArchivedPage";
import PublicPile from "./pages/PublicPile";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HeroPublicPile from "./components/HeroPublicPile";
const App = () => {
  const router = createBrowserRouter([
    { path: "*", element: <NotFound /> },
    { path: "/", element: <HomePage /> },
    { path: "/archived", element: <ArchivedPage /> },
    {
      path: "/api/share/:uuID",
      element: (
        <div>
          <HeroPublicPile />
          <PublicPile />
        </div>
      ),
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
