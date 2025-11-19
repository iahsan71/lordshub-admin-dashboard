import { useState } from 'react'
import { DashboardCards } from '@/components/dashboard-cards'
import { RevenueChart } from '@/components/revenue-chart'
import { ActivityChart } from '@/components/activity-chart'
import { RecentActivity } from '@/components/recent-activity'

export default function DashboardPage() {
  const [dateRange] = useState('7d')

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your performance overview.</p>
      </div>

      {/* Analytics Cards */}
      <DashboardCards />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <ActivityChart />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <RecentActivity />
      </div>
    </div>
  )
}
