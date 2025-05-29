"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, TrendingUp } from "lucide-react";

export function ExpenseStats() {
  const summaryData = [
    {
      title: "Total Expenses (This Month)",
      value: "$15,300.00",
      change: "+8.2%",
      trend: "down",
      progress: 68
    },
    {
      title: "Biggest Expense",
      value: "$5,200.00",
      description: "Advertising",
      progress: 83
    },
    {
      title: "Top Expense Category",
      value: "Advertising",
      amount: "$6,800.00",
      progress: 75
    },
    {
      title: "Top Platform",
      value: "Facebook",
      amount: "$3,600.00",
      progress: 62
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            {item.change && (
              <div className="flex items-center pt-1">
                {item.trend === "up" ? (
                  <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4 text-rose-500" />
                )}
                <span className={item.trend === "up" ? "text-emerald-500" : "text-rose-500"}>
                  {item.change}
                </span>
                <span className="text-xs text-muted-foreground ml-1">vs. last month</span>
              </div>
            )}
            {item.description && (
              <div className="pt-1 text-sm text-muted-foreground">
                {item.description}
              </div>
            )}
            {item.amount && (
              <div className="pt-1 text-sm text-muted-foreground">
                {item.amount}
              </div>
            )}
            <div className="mt-3">
              <Progress value={item.progress} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}