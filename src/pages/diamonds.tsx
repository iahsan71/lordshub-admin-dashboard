import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Diamond = {
  id: string;
  title: string;
  amount: string;
  price: number;
  game: string;
  status: "Available" | "Sold" | "Pending";
  bonus?: string;
};

export default function DiamondsPage() {
  const [diamonds, setDiamonds] = useState<Diamond[]>([
    {
      id: "1",
      title: "Free Fire Diamonds",
      amount: "1,000 Diamonds",
      price: 49,
      game: "Free Fire",
      status: "Available",
      bonus: "+100 Bonus",
    },
    {
      id: "2",
      title: "Free Fire Diamonds",
      amount: "2,000 Diamonds",
      price: 89,
      game: "Free Fire",
      status: "Available",
      bonus: "+250 Bonus",
    },
  ]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Diamonds Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage diamonds packages for Free Fire</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all w-full sm:w-auto">
          + Add Diamonds Package
        </Button>
      </div>

      {/* Calculator Card */}
      <Card className="border-secondary/30 shadow-lg bg-gradient-to-br from-secondary/5 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>💎</span>
            Diamonds Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Diamonds Amount</Label>
              <Input placeholder="Enter amount" className="bg-input border-border" />
            </div>
            <div>
              <Label>Rate per Diamond</Label>
              <Input placeholder="$0.05" className="bg-input border-border" />
            </div>
            <div>
              <Label>Total Price</Label>
              <div className="h-10 flex items-center px-3 rounded-md bg-muted text-lg font-bold text-secondary">
                $0.00
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diamonds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {diamonds.map((diamond, idx) => (
          <Card
            key={diamond.id}
            className="border-secondary/20 hover:border-secondary/50 transition-all hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {diamond.bonus && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-secondary to-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                {diamond.bonus}
              </div>
            )}
            <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3">
                <span className="text-4xl">💎</span>
                <div>
                  <CardTitle className="text-lg">{diamond.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{diamond.game}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="text-center py-6 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-lg">
                  <p className="text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                    {diamond.amount}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-2xl font-bold text-secondary">${diamond.price}</span>
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
