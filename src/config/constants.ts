export const APP_NAME = 'Admin Dashboard';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Professional Admin Dashboard';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/dashboard/products',
  OFFERS: '/dashboard/offers',
  ANALYTICS: '/dashboard/analytics',
  CHAT: '/dashboard/chat',
  SETTINGS: '/dashboard/settings',
};

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
