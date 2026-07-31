import { createBrowserRouter } from "react-router";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Register from "./pages/RegisterPage"
import Home from "./pages/HomePage"
import LoginPage from "./pages/LoginPage";
import RestoreBackupPage from "./pages/RestoreBackupPage";

const router = createBrowserRouter([
  {
    Component: ProtectedRoutes,
    children: [
      {
        path: "/",
        Component: Home
      }
    ]
  },
  {
    path: "/register",
    Component: Register
  },
  {
    path: "/login",
    Component: LoginPage
  },
  {
    path: "/restore",
    Component: RestoreBackupPage
  }
])

export default router