"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const budgetSummary = [
  {
    title: "Total Budget",
    value: "$25,000.00",
    period: "Monthly",
    spent: "$15,300.00",
    percent: 61,
    status: "on-track"
  },
  {
    title: "Marketing Budget",
    value: "$10,000.00",
    period: "Monthly",
    spent: "$6,800.00",
    percent: 68,
    status: "on-track"
  },
  {
    title: "Operational Budget",
    value: "$12,000.00",
    period: "Monthly",
    spent: "$6,950.00",
    percent: 58,
    status: "on-track"
  },
  {
    title: "Investment Budget",
    value: "$3,000.00",
    period: "Monthly",
    spent: "$1,550.00",
    percent: 52,
    status: "on-track"
  }
];

const data = [
  { name: 'Jan', budget: 20000, actual: 18500 },
  { name: 'Feb', budget: 22000, actual: 21000 },
  { name: 'Mar', budget: 23000, actual: 22500 },
  { name: 'Apr', budget: 25000, actual: 23800 },
  { name: 'May', budget: 25000, actual: 24300 },
  { name: 'Jun', budget: 25000, actual: 15300 },
];

export function BudgetOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {budgetSummary.map((item, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <CardDescription>{item.period}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-1">
                <div className="text-2xl font-bold">{item.value}</div>
                <Badge 
                  variant={
                    item.status === "on-track" 
                      ? "outline" 
                      : item.status === "over-budget" 
                        ? "destructive" 
                        : "secondary"
                  }
                >
                  {item.status === "on-track" ? "On Track" : item.status === "over-budget" ? "Over Budget" : "Under Budget"}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span>Spent: {item.spent}</span>
                <span>{item.percent}%</span>
              </div>
              <Progress value={item.percent} />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Budget vs. Actual Expenses</CardTitle>
          <CardDescription>Monthly comparison for the current year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12 }} 
                  className="text-muted-foreground" 
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                />
                <Legend />
                <Bar dataKey="budget" fill="hsl(var(--chart-1))" name="Budget" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="hsl(var(--chart-2))" name="Actual" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}