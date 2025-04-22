import AuthForm from "./pages/AuthForm";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";

function App() {
  const router = createBrowserRouter([
    {
      element: <AuthForm />,
      path: "/",
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
        {
          path: "/forget",
          element: <ForgetPasswordPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
