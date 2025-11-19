import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const stats = [
  { title: 'Total Revenue', value: '$45,231.89', change: '+20.1%' },
  { title: 'Total Orders', value: '1,429', change: '+15%' },
  { title: 'Active Users', value: '2,543', change: '+8.2%' },
  { title: 'Conversion Rate', value: '3.24%', change: '+0.5%' },
]

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
