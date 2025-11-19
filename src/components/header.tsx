"use client";

import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { user } = useAuth();

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">Welcome back, Admin</h2>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium capitalize">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <Avatar className="h-10 w-10">
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
