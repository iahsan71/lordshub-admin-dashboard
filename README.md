# Lords Hub - Admin Dashboard

A comprehensive admin panel for managing gaming products, chat, offers, and analytics with a beautiful bluish-yellow theme.

## 🎨 Features

### 1. **Dashboard Overview**
- Real-time statistics cards with animations
- Total Products, Sold Products, Pending Payments, Open Chats, Total Revenue
- Products by Category (pie chart visualization)
- Recent Activity feed
- Quick Actions for common tasks

### 2. **Product Management**
Organized into 4 main categories with dedicated pages:

#### 📱 **Accounts** (`/dashboard/accounts`)
- Lords Mobile, PUBG, Free Fire accounts
- Detailed specifications (Castle Star, Might, Troops, etc.)
- Image gallery support (6-10 images)
- Status tracking (Available/Sold/Pending)
- Advanced filters and search

#### 💎 **Diamonds** (`/dashboard/diamonds`)
- Free Fire diamonds packages
- Built-in calculator for pricing
- Bonus badges
- Attractive card-based UI

#### 💠 **Gems** (`/dashboard/gems`)
- Lords Mobile gems packages
- Quick stats overview
- Package management

#### 🤖 **Bots** (`/dashboard/bots`)
- Gaming automation tools
- Subscription management
- Feature lists
- Duration tracking

### 3. **Chat Management** (`/dashboard/chat`)
- Real-time customer conversations
- Chat list with filters (New, Payment Marked, Verified, Completed)
- Status badges and unread counters
- Quick reply templates
- Order status timeline
- File attachment support
- Payment proof display



## 🎨 Design Features

### Theme
- **Primary Color**: Blue (#3b82f6)
- **Secondary Color**: Yellow (#fbbf24)
- **Dark Background**: Navy (#0a0e27, #1a1f3a)
- Gradient combinations throughout
- Smooth animations and transitions

### UI Components
- Animated cards with hover effects
- Gradient buttons and badges
- Custom scrollbars
- Responsive grid layouts
- Smooth page transitions
- Loading animations

## 🚀 Technology Stack

- **Frontend**: React.js + TypeScript + Vite
- **Styling**: Tailwind CSS with custom theme
- **Routing**: React Router DOM
- **Backend**: Firebase
  - Authentication (Admin login)
  - Firestore (Products, Settings, Offers)
  - Realtime Database (Chat system)
  - Storage (Images, Videos)
  - Analytics

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔥 Firebase Configuration

Update `src/config/firebase.ts` with your Firebase credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

## 📱 Routes

- `/` - Redirects to dashboard
- `/login` - Admin login
- `/dashboard` - Main dashboard
- `/dashboard/accounts` - Accounts management
- `/dashboard/gems` - Gems management
- `/dashboard/diamonds` - Diamonds management
- `/dashboard/bots` - Bots management
- `/dashboard/chat` - Chat management

## 🔐 Security

- Admin-only authentication
- Protected routes with AuthGuard
- Firebase Security Rules (configure in Firebase Console)
- Secure file upload validation

## 🎯 Key Features Implementation

### Sidebar Navigation
- Collapsible product categories
- Active route highlighting
- Gradient hover effects
- Smooth animations

### Product Cards
- Image galleries
- Status badges
- Quick actions (Edit/Delete)
- Hover animations

### Chat System
- Real-time messaging
- Status management
- Quick replies
- File attachments
- Unread counters

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Flexible grid layouts
- Touch-friendly interfaces

## 📊 Firebase Collections Structure

```
products/
  - id
  - title
  - description
  - price
  - category (Accounts/Gems/Diamonds/Bots)
  - subCategory
  - specifications {}
  - images []
  - status
  - createdAt

settings/
  - bankDetails {}
  - contactInfo {}
  - platformSettings {}
  - socialMedia {}

offers/
  - id
  - title
  - discount
  - startDate
  - endDate
  - status
  - productIds []
  - bannerImage

chats/ (Realtime Database)
  - chatId/
    - messages/
    - status
    - customer
    - lastMessage
```

## 🎨 Customization

The theme can be customized in `src/index.css`:
- Modify CSS variables for colors
- Adjust gradient combinations
- Update animation timings
- Change border radius values

## 📝 License

Private - Lords Hub Gaming Platform

## 🤝 Support

For support, contact: support@lordshub.com
