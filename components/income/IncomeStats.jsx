"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, TrendingUp } from "lucide-react";

export function IncomeStats() {
  const summaryData = [
    {
      title: "Total Income (This Month)",
      value: "$24,500.00",
      change: "+15.3%",
      trend: "up",
      progress: 85
    },
    {
      title: "Average per Client",
      value: "$4,900.00",
      change: "+8.1%",
      trend: "up",
      progress: 62
    },
    {
      title: "Highest Earning Category",
      value: "Web Development",
      amount: "$12,800.00",
      progress: 95
    },
    {
      title: "Top Platform",
      value: "Direct",
      amount: "$15,600.00",
      progress: 78
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