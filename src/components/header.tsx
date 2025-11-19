import { useAuth } from '@/contexts/auth-context'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function Header() {
  const { user } = useAuth()

  return (
    <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">Welcome back</h2>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Avatar>
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      )}
    </header>
  )
}
