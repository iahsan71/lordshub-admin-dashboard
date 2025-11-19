import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-muted rounded flex items-center justify-center text-muted-foreground">
          Chart will be rendered here
        </div>
      </CardContent>
    </Card>
  )
}
