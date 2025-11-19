import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/auth-context'
import { ProtectedRoute } from './components/protected-route'
import { ThemeProvider } from './components/theme-provider'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import DashboardLayout from './layouts/dashboard-layout'
import DashboardPage from './pages/dashboard'
import ProductsPage from './pages/dashboard/products'
import ProductDetailPage from './pages/dashboard/products/[id]'
import NewProductPage from './pages/dashboard/products/new'
import OffersPage from './pages/dashboard/offers'
import OfferDetailPage from './pages/dashboard/offers/[id]'
import NewOfferPage from './pages/dashboard/offers/new'
import ChatPage from './pages/dashboard/chat'
import AnalyticsPage from './pages/dashboard/analytics'
import SettingsPage from './pages/dashboard/settings'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="products/new" element={<NewProductPage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="offers/:id" element={<OfferDetailPage />} />
            <Route path="offers/new" element={<NewOfferPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}
