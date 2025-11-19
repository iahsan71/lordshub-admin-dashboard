import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Account = {
  id: string;
  title: string;
  price: number;
  category: string;
  status: "Available" | "Sold" | "Pending";
  castleStar: string;
  might: string;
  troops: string;
  images: string[];
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "1",
      title: "Lords Mobile - Castle 25 Account",
      price: 299,
      category: "Lords Mobile",
      status: "Available",
      castleStar: "25",
      might: "500M",
      troops: "10M T4",
      images: [],
    },
  ]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAccounts = accounts.filter((acc) => {
    const matchesFilter = filter === "All" || acc.status === filter;
    const matchesSearch = acc.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Accounts Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage game accounts inventory</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all w-full sm:w-auto">
          + Add New Account
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-primary/20 shadow-lg">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Search</Label>
              <Input
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-input border-border"
              />
            </div>
            <div>
              <Label>Status Filter</Label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-md border border-border bg-input px-3 py-2 text-foreground"
              >
                <option>All</option>
                <option>Available</option>
                <option>Sold</option>
                <option>Pending</option>
              </select>
            </div>
            <div>
              <Label>Price Range</Label>
              <Input placeholder="Min - Max" className="bg-input border-border" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredAccounts.map((account, idx) => (
          <Card
            key={account.id}
            className="border-primary/20 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{account.title}</CardTitle>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    account.status === "Available"
                      ? "bg-green-500/20 text-green-400"
                      : account.status === "Sold"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {account.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Castle:</span>
                  <span className="ml-2 font-semibold text-secondary">{account.castleStar}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Might:</span>
                  <span className="ml-2 font-semibold text-primary">{account.might}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Troops:</span>
                  <span className="ml-2 font-semibold">{account.troops}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-secondary">${account.price}</span>
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
