import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const stats = [
    { id: 1, label: "Total Sales", value: "$12,345" },
    { id: 2, label: "Active Users", value: "1,234" },
    { id: 3, label: "Open Chats", value: "8" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle>{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No recent activity to show.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
