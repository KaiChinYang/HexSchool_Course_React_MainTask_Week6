import { RouterProvider } from "react-router";
import { router } from "./router";
import './assets/style.css'

export default function App() {
  return <RouterProvider router={router}></RouterProvider>;
}
