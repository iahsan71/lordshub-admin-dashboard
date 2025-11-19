import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-muted rounded flex items-center justify-center text-muted-foreground">
          Chart will be rendered here
        </div>
      </CardContent>
    </Card>
  )
}
