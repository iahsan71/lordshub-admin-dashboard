import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const stats = [
    { 
      id: 1, 
      label: "Total Products", 
      value: "156", 
      change: "+12%",
      icon: "📦",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      id: 2, 
      label: "Sold Products", 
      value: "89", 
      change: "+23%",
      icon: "✅",
      color: "from-green-500 to-emerald-500"
    },
    { 
      id: 3, 
      label: "Pending Payments", 
      value: "12", 
      change: "-5%",
      icon: "⏳",
      color: "from-yellow-500 to-orange-500"
    },
    { 
      id: 4, 
      label: "Open Chats", 
      value: "24", 
      change: "+8%",
      icon: "💬",
      color: "from-purple-500 to-pink-500"
    },
    { 
      id: 5, 
      label: "Total Revenue", 
      value: "$45,231", 
      change: "+18%",
      icon: "💰",
      color: "from-green-600 to-teal-500"
    },
  ];

  const quickActions = [
    { label: "Add New Product", icon: "➕", href: "/dashboard/accounts", color: "from-primary to-blue-600" },
    { label: "View All Chats", icon: "💬", href: "/dashboard/chat", color: "from-purple-500 to-pink-500" },
    { label: "Manage Accounts", icon: "👤", href: "/dashboard/accounts", color: "from-green-500 to-emerald-500" },
    { label: "Manage Gems", icon: "💎", href: "/dashboard/gems", color: "from-purple-600 to-indigo-500" },
  ];

  const recentActivity = [
    { id: 1, type: "sale", message: "New sale: Lords Mobile Castle 25", time: "2 min ago", icon: "✅" },
    { id: 2, type: "chat", message: "New chat from customer #1234", time: "5 min ago", icon: "💬" },
    { id: 3, type: "payment", message: "Payment verified for Order #5678", time: "12 min ago", icon: "💰" },
    { id: 4, type: "product", message: "New product added: Free Fire Diamonds", time: "1 hour ago", icon: "📦" },
  ];

  const categoryStats = [
    { name: "Accounts", count: 45, percentage: 35, color: "bg-blue-500" },
    { name: "Diamonds", count: 38, percentage: 30, color: "bg-yellow-500" },
    { name: "Gems", count: 25, percentage: 20, color: "bg-purple-500" },
    { name: "Bots", count: 19, percentage: 15, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {stats.map((stat, idx) => (
          <Card
            key={stat.id}
            className="border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg animate-in fade-in slide-in-from-top-4"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <CardContent className="pt-6">
              <div className={`bg-gradient-to-r ${stat.color} p-4 rounded-lg text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{stat.icon}</span>
                  <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded">
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm opacity-90">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, idx) => (
              <Link key={idx} to={action.href}>
                <Button
                  className={`w-full h-20 sm:h-24 bg-gradient-to-r ${action.color} hover:shadow-xl transition-all text-white text-base sm:text-lg`}
                >
                  <span className="mr-2 text-xl sm:text-2xl">{action.icon}</span>
                  <span className="hidden sm:inline">{action.label}</span>
                  <span className="sm:hidden">{action.label.split(' ')[0]}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Products by Category */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.map((cat, idx) => (
                <div
                  key={idx}
                  className="animate-in fade-in slide-in-from-left-4"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {cat.count} products ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color} transition-all duration-1000`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg hover:from-primary/10 hover:to-secondary/10 transition-all animate-in fade-in slide-in-from-right-4"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <span className="text-2xl">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
