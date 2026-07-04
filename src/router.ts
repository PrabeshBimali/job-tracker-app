import { createBrowserRouter } from "react-router";
import Register from "./pages/RegisterPage"
import Home from "./pages/HomePage"
import LoginPage from "./pages/LoginPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home
  },
  {
    path: "/register",
    Component: Register
  },
  {
    path: "/login",
    Component: LoginPage
  }
])

export default router