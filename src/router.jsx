import { createHashRouter } from "react-router";
import Home from "./pages/front/Home";
import FrontendLayout from "./layout/FrontendLayout";
import Products from "./pages/front/Products";
import SingleProduct from "./pages/front/SingleProduct";
import Cart from "./pages/front/Cart";
import NotFound from "./pages/front/NotFound";

//路由表
export const router = createHashRouter([
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
