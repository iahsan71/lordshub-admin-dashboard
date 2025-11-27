import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { subscribeToAccounts } from "@/store/actions/accountsActions";
import { subscribeToDiamonds } from "@/store/actions/diamondsActions";
import { subscribeToBots } from "@/store/actions/botsActions";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { accounts } = useAppSelector((state) => state.accounts);
  const { diamonds } = useAppSelector((state) => state.diamonds);
  const { bots } = useAppSelector((state) => state.bots);

  // Subscribe to all collections
  useEffect(() => {
    const unsubAccounts = dispatch(subscribeToAccounts());
    const unsubDiamonds = dispatch(subscribeToDiamonds());
    const unsubBots = dispatch(subscribeToBots());

    return () => {
      if (unsubAccounts) unsubAccounts();
      if (unsubDiamonds) unsubDiamonds();
      if (unsubBots) unsubBots();
    };
  }, [dispatch]);

  // Calculate dynamic stats
  const totalProducts = accounts.length + diamonds.length + bots.length;
  const restrictedAccounts = accounts.filter(a => a.type === 'restricted').length;
  const openAccounts = accounts.filter(a => a.type === 'open').length;
  const warBots = bots.filter(b => b.type === 'war').length;
  const reinBots = bots.filter(b => b.type === 'rein').length;
  const kvkBots = bots.filter(b => b.type === 'kvk').length;
  const farmBots = bots.filter(b => b.type === 'farm').length;

  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    const accountsRevenue = accounts.reduce((sum, acc) => sum + acc.price, 0);
    const diamondsRevenue = diamonds.reduce((sum, dia) => sum + dia.price, 0);
    const botsRevenue = bots.reduce((sum, bot) => sum + bot.price, 0);
    return accountsRevenue + diamondsRevenue + botsRevenue;
  }, [accounts, diamonds, bots]);

  // Calculate category percentages
  const categoryStats = useMemo(() => {
    if (totalProducts === 0) {
      return [
        { name: "Accounts", count: 0, percentage: 0, color: "bg-blue-500" },
        { name: "Diamonds", count: 0, percentage: 0, color: "bg-yellow-500" },
        { name: "Bots", count: 0, percentage: 0, color: "bg-green-500" },
      ];
    }

    return [
      { 
        name: "Accounts", 
        count: accounts.length, 
        percentage: Math.round((accounts.length / totalProducts) * 100), 
        color: "bg-blue-500" 
      },
      { 
        name: "Diamonds", 
        count: diamonds.length, 
        percentage: Math.round((diamonds.length / totalProducts) * 100), 
        color: "bg-yellow-500" 
      },
      { 
        name: "Bots", 
        count: bots.length, 
        percentage: Math.round((bots.length / totalProducts) * 100), 
        color: "bg-green-500" 
      },
    ];
  }, [accounts.length, diamonds.length, bots.length, totalProducts]);

  const stats = [
    { 
      id: 1, 
      label: "Total Products", 
      value: totalProducts.toString(), 
      icon: "📦",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      id: 2, 
      label: "Total Accounts", 
      value: accounts.length.toString(), 
      icon: "👤",
      color: "from-green-500 to-emerald-500"
    },
    { 
      id: 3, 
      label: "Total Diamonds", 
      value: diamonds.length.toString(), 
      icon: "💎",
      color: "from-yellow-500 to-orange-500"
    },
    { 
      id: 4, 
      label: "Total Bots", 
      value: bots.length.toString(), 
      icon: "🤖",
      color: "from-purple-500 to-pink-500"
    },
    { 
      id: 5, 
      label: "Total Value", 
      value: `$${totalRevenue.toLocaleString()}`, 
      icon: "💰",
      color: "from-green-600 to-teal-500"
    },
  ];

  const quickActions = [
    { label: "Restricted Accounts", icon: "🔒", href: "/dashboard/accounts/restricted", color: "from-red-500 to-pink-600" },
    { label: "Open Accounts", icon: "🔓", href: "/dashboard/accounts/open", color: "from-green-500 to-emerald-500" },
    { label: "Manage Diamonds", icon: "💎", href: "/dashboard/diamonds", color: "from-yellow-500 to-orange-500" },
    { label: "Manage Bots", icon: "🤖", href: "/dashboard/bots/war", color: "from-purple-500 to-indigo-500" },
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
                <div className="flex items-center justify-center mb-2">
                  <span className="text-4xl">{stat.icon}</span>
                </div>
                <p className="text-sm opacity-90 text-center">{stat.label}</p>
                <p className="text-3xl font-bold mt-1 text-center">{stat.value}</p>
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

        {/* Detailed Breakdown */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Product Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔒</span>
                  <span className="font-medium">Restricted Accounts</span>
                </div>
                <span className="text-lg font-bold text-red-500">{restrictedAccounts}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg animate-in fade-in slide-in-from-right-4" style={{ animationDelay: "100ms" }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔓</span>
                  <span className="font-medium">Open Accounts</span>
                </div>
                <span className="text-lg font-bold text-green-500">{openAccounts}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg animate-in fade-in slide-in-from-right-4" style={{ animationDelay: "200ms" }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚔️</span>
                  <span className="font-medium">War Bots</span>
                </div>
                <span className="text-lg font-bold text-blue-500">{warBots}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg animate-in fade-in slide-in-from-right-4" style={{ animationDelay: "300ms" }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛡️</span>
                  <span className="font-medium">Rein Bots</span>
                </div>
                <span className="text-lg font-bold text-purple-500">{reinBots}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg animate-in fade-in slide-in-from-right-4" style={{ animationDelay: "400ms" }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏆</span>
                  <span className="font-medium">KVK Bots</span>
                </div>
                <span className="text-lg font-bold text-yellow-500">{kvkBots}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-lg animate-in fade-in slide-in-from-right-4" style={{ animationDelay: "500ms" }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  <span className="font-medium">Farm/Bank Bots</span>
                </div>
                <span className="text-lg font-bold text-green-500">{farmBots}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
