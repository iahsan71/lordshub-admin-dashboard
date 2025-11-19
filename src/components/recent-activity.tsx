import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">Activity item {i}</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <span className="text-sm font-medium">+$100</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
