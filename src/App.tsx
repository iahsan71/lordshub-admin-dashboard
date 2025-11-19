import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import DashboardPage from "./pages/dashboard";
import ProductsPage from "./pages/products";
import ChatPage from "./pages/chat";
import AccountsPage from "./pages/accounts";
import GemsPage from "./pages/gems";
import DiamondsPage from "./pages/diamonds";
import BotsPage from "./pages/bots";
import { AuthGuard } from "./components/authGuard";
import DashboardLayout from "./components/dashboardLayout";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="gems" element={<GemsPage />} />
          <Route path="diamonds" element={<DiamondsPage />} />
          <Route path="bots" element={<BotsPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
