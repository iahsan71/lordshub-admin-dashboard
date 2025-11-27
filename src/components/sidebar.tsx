import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { JSX, useState } from "react";
import { ConfirmationModal } from "./ui/confirmationModal";
import logo from "../assets/imgs/logo.png";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { 
    name: "Products", 
    icon: "Package",
    subItems: [
      { 
        name: "Accounts", 
        icon: "User",
        subItems: [
          { name: "Restricted Kingdom", href: "/dashboard/accounts/restricted", icon: "Lock" },
          { name: "Open Kingdom", href: "/dashboard/accounts/open", icon: "Unlock" },
        ]
      },
      { name: "Gems", href: "/dashboard/gems", icon: "Gem" },
      { name: "Diamonds", href: "/dashboard/diamonds", icon: "Diamond" },
      { 
        name: "Bots", 
        icon: "Bot",
        subItems: [
          { name: "War Bots", href: "/dashboard/bots/war", icon: "Sword" },
          { name: "Rein Bots", href: "/dashboard/bots/rein", icon: "Shield" },
          { name: "KVK Bots", href: "/dashboard/bots/kvk", icon: "Trophy" },
          { name: "Farm/Bank Bots", href: "/dashboard/bots/farm", icon: "Coins" },
        ]
      },
    ]
  },
  { name: "Chat", href: "/dashboard/chat", icon: "MessageSquare" },
];

function getIcon(iconName: string) {
  const icons: Record<string, JSX.Element> = {
    LayoutDashboard: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    Package: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    User: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    Lock: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    Unlock: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
      </svg>
    ),
    Gem: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    Diamond: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l7 18M19 3l-7 18M3 8h18M4 16h16" />
      </svg>
    ),
    Bot: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    MessageSquare: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    ChevronDown: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    Sword: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 3l-9 9m0 0L3 21m9-9l9 9M3 3l9 9" />
      </svg>
    ),
    Shield: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    Trophy: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    Coins: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };
  return icons[iconName] || null;
}

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["Products", "Accounts", "Bots"]);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Lords Hub Logo"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <span className="font-bold text-sidebar-foreground block">Lords Hub</span>
                <span className="text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-sidebar-accent/20 text-sidebar-foreground transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const hasSubItems = 'subItems' in item && item.subItems;
            const isExpanded = expandedItems.includes(item.name);
            
            if (hasSubItems) {
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all hover:bg-sidebar-accent/20 text-sidebar-foreground"
                  >
                    <div className="flex items-center gap-3">
                      {getIcon(item.icon)}
                      <span>{item.name}</span>
                    </div>
                    <div className={cn("transition-transform", isExpanded && "rotate-180")}>
                      {getIcon("ChevronDown")}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="ml-4 space-y-1 animate-in slide-in-from-top-2">
                      {item.subItems.map((subItem) => {
                        const hasNestedSubItems = 'subItems' in subItem && subItem.subItems;
                        const isNestedExpanded = expandedItems.includes(subItem.name);
                        
                        if (hasNestedSubItems) {
                          return (
                            <div key={subItem.name} className="space-y-1">
                              <button
                                onClick={() => toggleExpand(subItem.name)}
                                className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-sidebar-accent/20 text-sidebar-foreground"
                              >
                                <div className="flex items-center gap-2">
                                  {getIcon(subItem.icon)}
                                  <span>{subItem.name}</span>
                                </div>
                                <div className={cn("transition-transform", isNestedExpanded && "rotate-180")}>
                                  {getIcon("ChevronDown")}
                                </div>
                              </button>
                              {isNestedExpanded && (
                                <div className="ml-4 space-y-1 animate-in slide-in-from-top-2">
                                  {subItem.subItems.map((nestedItem) => {
                                    const isActive = location.pathname === nestedItem.href;
                                    return (
                                      <Link
                                        key={nestedItem.href}
                                        to={nestedItem.href}
                                        onClick={handleLinkClick}
                                        className={cn(
                                          "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                                          isActive
                                            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                                            : "text-sidebar-foreground hover:bg-sidebar-accent/20 hover:translate-x-1"
                                        )}
                                      >
                                        {getIcon(nestedItem.icon)}
                                        <span>{nestedItem.name}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        }
                        
                        const isActive = location.pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            onClick={handleLinkClick}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                              isActive
                                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                                : "text-sidebar-foreground hover:bg-sidebar-accent/20 hover:translate-x-1"
                            )}
                          >
                            {getIcon(subItem.icon)}
                            <span>{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/20 hover:translate-x-1"
                )}
              >
                {getIcon(item.icon)}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full px-4 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-destructive to-destructive/80 text-white hover:shadow-lg transition-all"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
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
