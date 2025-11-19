import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Bot = {
  id: string;
  title: string;
  type: string;
  price: number;
  duration: string;
  features: string[];
  status: "Available" | "Sold" | "Pending";
};

export default function BotsPage() {
  const [bots, setBots] = useState<Bot[]>([
    {
      id: "1",
      title: "Auto Farm Bot",
      type: "Lords Mobile",
      price: 29,
      duration: "30 Days",
      features: ["Auto Resource Collection", "Auto Building", "Safe Mode"],
      status: "Available",
    },
    {
      id: "2",
      title: "Battle Bot Pro",
      type: "Lords Mobile",
      price: 49,
      duration: "30 Days",
      features: ["Auto Attack", "Smart Targeting", "Anti-Ban Protection"],
      status: "Available",
    },
  ]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Bots Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage gaming bots and automation tools</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all w-full sm:w-auto">
          + Add New Bot
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Active Bots", value: "12", color: "from-blue-500 to-cyan-500" },
          { label: "Subscriptions", value: "48", color: "from-purple-500 to-pink-500" },
          { label: "Monthly Revenue", value: "$1,890", color: "from-green-500 to-emerald-500" },
          { label: "Avg Rating", value: "4.8⭐", color: "from-yellow-500 to-orange-500" },
        ].map((stat, idx) => (
          <Card
            key={idx}
            className="border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg animate-in fade-in slide-in-from-top-4"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <CardContent className="pt-6">
              <div className={`bg-gradient-to-r ${stat.color} p-4 rounded-lg text-white`}>
                <p className="text-sm opacity-90">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {bots.map((bot, idx) => (
          <Card
            key={bot.id}
            className="border-primary/20 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🤖</span>
                  <div>
                    <CardTitle className="text-lg">{bot.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{bot.type}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                  {bot.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between py-2 px-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-semibold text-secondary">{bot.duration}</span>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">Features:</p>
                <ul className="space-y-1">
                  {bot.features.map((feature, i) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <span className="text-2xl font-bold text-primary">${bot.price}</span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-primary/50 hover:bg-primary/10">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="border-destructive/50 hover:bg-destructive/10">
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
