import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/auth.layout";
import LoginPage from "./pages/login.page";
import RegisterPage from "./pages/register.page";
import DashboardPage from "./pages/dashboard.page";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route Component={AuthLayout}>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
        </Route>
        <Route path="/dashboard" element={<DashboardPage />}></Route>
        <Route
          path="*"
          element={
            <>
              <h1>Not found</h1>
            </>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
