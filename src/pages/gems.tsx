import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Gem = {
  id: string;
  title: string;
  amount: string;
  price: number;
  game: string;
  status: "Available" | "Sold" | "Pending";
};

export default function GemsPage() {
  const [gems, setGems] = useState<Gem[]>([
    {
      id: "1",
      title: "Lords Mobile Gems Pack",
      amount: "14,000 Gems",
      price: 99,
      game: "Lords Mobile",
      status: "Available",
    },
    {
      id: "2",
      title: "Lords Mobile Gems Pack",
      amount: "30,000 Gems",
      price: 199,
      game: "Lords Mobile",
      status: "Available",
    },
  ]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Gems Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage gems packages and pricing</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all w-full sm:w-auto">
          + Add Gems Package
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Packages", value: "24", icon: "📦" },
          { label: "Available", value: "18", icon: "✅" },
          { label: "Sold Today", value: "6", icon: "💰" },
          { label: "Revenue", value: "$1,240", icon: "💵" },
        ].map((stat, idx) => (
          <Card
            key={idx}
            className="border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg animate-in fade-in slide-in-from-top-4"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gems Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {gems.map((gem, idx) => (
          <Card
            key={gem.id}
            className="border-primary/20 hover:border-secondary/50 transition-all hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <CardHeader className="bg-gradient-to-br from-secondary/10 to-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">💎</span>
                  <div>
                    <CardTitle className="text-lg">{gem.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{gem.game}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                  {gem.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="text-center py-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                  <p className="text-3xl font-bold text-secondary">{gem.amount}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-2xl font-bold text-primary">${gem.price}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-primary/50 hover:bg-primary/10">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="border-destructive/50 hover:bg-destructive/10">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
