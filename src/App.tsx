import { Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "./contexts/auth-context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";
import ProductsPage from "./pages/products";
import ChatPage from "./pages/chat";
import AccountsPage from "./pages/accounts";
import GemsPage from "./pages/gems";
import DiamondsPage from "./pages/diamonds";
import BotsPage from "./pages/bots";
import OffersPage from "./pages/offers";
import SocialMediaLinksPage from "./pages/socialMediaLinks";
import SettingsPage from "./pages/settings";
import { AuthGuard } from "./components/authGuard";
import DashboardLayout from "./components/dashboardLayout";

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />

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
            <Route path="accounts/restricted" element={<AccountsPage type="restricted" />} />
            <Route path="accounts/open" element={<AccountsPage type="open" />} />
            <Route path="gems" element={<GemsPage />} />
            <Route path="diamonds" element={<DiamondsPage />} />
            <Route path="bots/war" element={<BotsPage type="war" />} />
            <Route path="bots/rein" element={<BotsPage type="rein" />} />
            <Route path="bots/kvk" element={<BotsPage type="kvk" />} />
            <Route path="bots/farm" element={<BotsPage type="farm" />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="social-media-links" element={<SocialMediaLinksPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Provider>
  );
}
