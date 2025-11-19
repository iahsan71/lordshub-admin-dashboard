"use client";

import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu Button - Only visible on mobile/tablet */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-semibold">Welcome back, Admin</h2>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium capitalize">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${firstLetter}&background=random&size=128`}
              alt={user.name}
            />
            <AvatarFallback>{firstLetter}</AvatarFallback>
          </Avatar>
        </div>
      )}
    </header>
  );
}
