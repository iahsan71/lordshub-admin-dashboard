import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { JSX, useState } from "react";
import logo from "@/assets/imgs/logo.png";
import { ConfirmationModal } from "./ui/confirmationModal";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { name: "Products", href: "/dashboard/products", icon: "Package" },
  { name: "Chat", href: "/dashboard/chat", icon: "MessageSquare" },
];

function getIcon(iconName: string) {
  const icons: Record<string, JSX.Element> = {
    LayoutDashboard: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25m0 0H5.25M7.5 10.875C7.5 10.254 8.004 9.75 8.625 9.75h2.25m0 0H9.75M15 10.875C15 10.254 15.504 9.75 16.125 9.75h2.25M19.125 12a.75.75 0 00-.75.75v2.25m0 0V21m0 0H3.75m16.5 0H21m0 0v-2.25m0-10.5a.75.75 0 00-.75-.75h-2.25M15 12.75h2.25"
        />
      </svg>
    ),
    Package: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 015.646 5.646 9 9 0 1020.354 15.354z"
        />
      </svg>
    ),
    MessageSquare: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 8h10M7 12h4m1 8l-4-2H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z"
        />
      </svg>
    ),
    Tag: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    ),
    Settings: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    BarChart3: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  };
  return icons[iconName] || null;
}

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Lords Hub Logo"
              className="w-12 h-12 rounded-lg object-cover"
            />
            <span className="font-bold text-sidebar-foreground">Lords Hub</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              location.pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/20 text-sidebar-foreground"
                )}
              >
                {getIcon(item.icon)}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full px-4 py-3 text-sm font-medium rounded-lg bg-sidebar-accent/20 text-sidebar-accent-foreground hover:bg-sidebar-accent/30 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
      <ConfirmationModal
        open={showLogoutModal}
        title="Confirm Logout"
        description="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
        }}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}
