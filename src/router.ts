import { createBrowserRouter } from "react-router";
import Register from "./pages/RegisterPage"
import Home from "./pages/HomePage"

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home
  },
  {
    path: "/register",
    Component: Register
  }
])

export default router