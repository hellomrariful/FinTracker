import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  PieChart,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Demo Dashboard | FinTracker",
  description:
    "Experience FinTracker's powerful financial dashboard with sample data.",
};

// Sample data for demo
const revenueData = [
  { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
  { month: "Feb", revenue: 52000, expenses: 35000, profit: 17000 },
  { month: "Mar", revenue: 48000, expenses: 33000, profit: 15000 },
  { month: "Apr", revenue: 61000, expenses: 38000, profit: 23000 },
  { month: "May", revenue: 55000, expenses: 36000, profit: 19000 },
  { month: "Jun", revenue: 67000, expenses: 41000, profit: 26000 },
];

const expenseCategories = [
  { name: "Ad Spend", value: 28000, color: "#3b82f6" },
  { name: "Software", value: 8500, color: "#10b981" },
  { name: "Salaries", value: 15000, color: "#f59e0b" },
  { name: "Office", value: 3200, color: "#ef4444" },
  { name: "Other", value: 2800, color: "#8b5cf6" },
];

const topPerformers = [
  { name: "Sarah Chen", revenue: 125000, campaigns: 12, roi: 340 },
  { name: "Marcus Rodriguez", revenue: 98000, campaigns: 8, roi: 285 },
  { name: "Emily Watson", revenue: 87000, campaigns: 10, roi: 265 },
  { name: "David Kim", revenue: 76000, campaigns: 6, roi: 245 },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-semibold">FinTracker Demo</h1>
              </div>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Demo Mode
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Demo Notice */}
        <div className="mb-8 rounded-lg bg-primary/5 border border-primary/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-primary">Interactive Demo</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            This is a live preview of FinTracker&apos;s dashboard with sample
            data. Experience the real interface and features before signing up.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$328,000</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$215,500</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -3.2% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$112,500</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +34.3% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROI</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">285%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18.2% from last month
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue vs Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Revenue vs Expenses chart will be displayed here
                  </p>
                  <div className="mt-4 space-y-2">
                    {revenueData.slice(0, 3).map((data, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span>{data.month}</span>
                        <span className="text-green-600">
                          ${data.revenue.toLocaleString()}
                        </span>
                        <span className="text-red-600">
                          ${data.expenses.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Expense Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center">
                  <PieChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Expense breakdown chart will be displayed here
                  </p>
                  <div className="mt-4 space-y-2">
                    {expenseCategories.slice(0, 3).map((category, index) => (
                      <div key={index} className="flex justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                        </div>
                        <span>${category.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Performing Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {performer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-semibold">{performer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {performer.campaigns} campaigns managed
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      ${performer.revenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600">
                      {performer.roi}% ROI
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-8 border border-primary/20">
            <h2 className="text-2xl font-bold mb-4">
              Ready to track your real data?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              This demo shows just a glimpse of FinTracker&apos;s capabilities.
              Connect your real financial data and start making data-driven
              decisions today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/pricing">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
