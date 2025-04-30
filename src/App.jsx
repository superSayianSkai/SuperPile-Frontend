import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import ArchivedPage from "./pages/ArchivedPage";
import { createBrowserRouter,RouterProvider } from "react-router-dom";
const App = () => {
  const router= createBrowserRouter([
    {path:"*", element:<NotFound/>}, 
    {path:"/",element:<HomePage/>},
    {path:"/archived",element:<ArchivedPage/>}
  ])
  return (
 <RouterProvider router={router}/>
  );
};

export default App;
