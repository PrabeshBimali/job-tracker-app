import { createBrowserRouter } from "react-router";
import Login from "./pages/LoginPage"
import Home from "./pages/HomePage"

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home
  },
  {
    path: "/login",
    Component: Login
  }
])

export default router