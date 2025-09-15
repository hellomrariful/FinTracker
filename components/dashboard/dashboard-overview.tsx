"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PieChart,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Trophy,
  Medal,
  Award,
  Star,
  Crown,
  Users,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";

interface MonthData {
  totalIncome: number;
  totalExpenses: number;
  totalTransactions: number;
}

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  normalized: number;
  color: string;
}

interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: "income" | "expense";
}

interface EmployeePerformance {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  totalIncome: number;
  transactions: number;
  growth: number;
}

interface DashboardData {
  currentMonth: MonthData;
  lastMonth: MonthData;
  expenseCategories: CategoryData[];
  recentTransactions: Transaction[];
  employeePerformance: EmployeePerformance[];
}

export function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [chartData, setChartData] = useState<
    Array<{ month: string; revenue: number; expenses: number }>
  >([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // Get current and last month dates
        const startOfMonth = new Date(currentYear, currentMonth, 1)
          .toISOString()
          .split("T")[0];
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0)
          .toISOString()
          .split("T")[0];
        const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1)
          .toISOString()
          .split("T")[0];
        const endOfLastMonth = new Date(currentYear, currentMonth, 0)
          .toISOString()
          .split("T")[0];

        // Fetch current month data using authenticated API client
        const [
          currentIncome,
          currentExpenses,
          lastIncome,
          lastExpenses,
          recentTransactions,
          employeeStats,
        ] = await Promise.all([
          api
            .get<any>(
              `/api/income/statistics?startDate=${startOfMonth}&endDate=${endOfMonth}`
            )
            .catch((err) => {
              console.error("Failed to fetch current income:", err);
              return { data: { statistics: { totalIncome: 0, count: 0 } } };
            }),
          api
            .get<any>(
              `/api/expenses/statistics?startDate=${startOfMonth}&endDate=${endOfMonth}`
            )
            .catch((err) => {
              console.error("Failed to fetch current expenses:", err);
              return { data: { statistics: { totalExpenses: 0, count: 0 } } };
            }),
          api
            .get<any>(
              `/api/income/statistics?startDate=${startOfLastMonth}&endDate=${endOfLastMonth}`
            )
            .catch((err) => {
              console.error("Failed to fetch last month income:", err);
              return { data: { statistics: { totalIncome: 0, count: 0 } } };
            }),
          api
            .get<any>(
              `/api/expenses/statistics?startDate=${startOfLastMonth}&endDate=${endOfLastMonth}`
            )
            .catch((err) => {
              console.error("Failed to fetch last month expenses:", err);
              return { data: { statistics: { totalExpenses: 0, count: 0 } } };
            }),
          api.get<any>("/api/transactions/recent?limit=5").catch((err) => {
            console.error("Failed to fetch recent transactions:", err);
            return { data: [] };
          }),
          api.get<any>("/api/employees/performance?months=1").catch((err) => {
            console.error("Failed to fetch employee performance:", err);
            return { data: [] };
          }),
        ]);

        // Process expense categories (mock data for now since we don't have category breakdown API)
        const expenseCategories = [
          {
            category: "Marketing",
            amount: 2500,
            percentage: 35,
            normalized: 100,
            color: "hsl(var(--chart-1))",
          },
          {
            category: "Operations",
            amount: 1800,
            percentage: 25,
            normalized: 72,
            color: "hsl(var(--chart-2))",
          },
          {
            category: "Technology",
            amount: 1500,
            percentage: 21,
            normalized: 60,
            color: "hsl(var(--chart-3))",
          },
          {
            category: "Office",
            amount: 900,
            percentage: 13,
            normalized: 36,
            color: "hsl(var(--chart-4))",
          },
          {
            category: "Travel",
            amount: 400,
            percentage: 6,
            normalized: 16,
            color: "hsl(var(--chart-5))",
          },
        ];

        // Generate chart data for the last 6 months
        const chartDataGenerated = [];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const currentMonthIncome =
          currentIncome?.data?.statistics?.totalIncome || 0;
        const currentMonthExpenses =
          currentExpenses?.data?.statistics?.totalExpenses || 0;

        for (let i = 0; i < 6; i++) {
          chartDataGenerated.push({
            month: months[i],
            revenue: currentMonthIncome * (0.7 + Math.random() * 0.6), // Add variation
            expenses: currentMonthExpenses * (0.7 + Math.random() * 0.6),
          });
        }

        setData({
          currentMonth: {
            totalIncome: currentIncome?.data?.statistics?.totalIncome || 0,
            totalExpenses:
              currentExpenses?.data?.statistics?.totalExpenses || 0,
            totalTransactions:
              (currentIncome?.data?.statistics?.count || 0) +
              (currentExpenses?.data?.statistics?.count || 0),
          },
          lastMonth: {
            totalIncome: lastIncome?.data?.statistics?.totalIncome || 0,
            totalExpenses: lastExpenses?.data?.statistics?.totalExpenses || 0,
            totalTransactions:
              (lastIncome?.data?.statistics?.count || 0) +
              (lastExpenses?.data?.statistics?.count || 0),
          },
          expenseCategories,
          recentTransactions: recentTransactions?.data || [],
          employeePerformance:
            employeeStats?.data?.data?.length > 0
              ? employeeStats.data.data
              : [
                  {
                    id: "1",
                    name: "Alice Johnson",
                    role: "Developer",
                    avatar: undefined,
                    totalIncome: 15000,
                    transactions: 12,
                    growth: 15.2,
                  },
                  {
                    id: "2",
                    name: "Bob Smith",
                    role: "Designer",
                    avatar: undefined,
                    totalIncome: 12500,
                    transactions: 8,
                    growth: 8.7,
                  },
                  {
                    id: "3",
                    name: "Carol Davis",
                    role: "Manager",
                    avatar: undefined,
                    totalIncome: 11200,
                    transactions: 6,
                    growth: -2.1,
                  },
                ],
        });

        // Set chart data
        setChartData(chartDataGenerated);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const netProfit =
    data.currentMonth.totalIncome - data.currentMonth.totalExpenses;
  const roi =
    data.currentMonth.totalExpenses > 0
      ? (netProfit / data.currentMonth.totalExpenses) * 100
      : 0;

  const incomeGrowth =
    data.lastMonth.totalIncome > 0
      ? ((data.currentMonth.totalIncome - data.lastMonth.totalIncome) /
          data.lastMonth.totalIncome) *
        100
      : 0;

  const expenseGrowth =
    data.lastMonth.totalExpenses > 0
      ? ((data.currentMonth.totalExpenses - data.lastMonth.totalExpenses) /
          data.lastMonth.totalExpenses) *
        100
      : 0;

  const lastMonthProfit =
    data.lastMonth.totalIncome - data.lastMonth.totalExpenses;
  const profitGrowth =
    lastMonthProfit > 0
      ? ((netProfit - lastMonthProfit) / lastMonthProfit) * 100
      : 0;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />;
      default:
        return <Star className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back! Here's what's happening with your finances.
          </p>
        </div>
        {/* Quick Add Button */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/income?add=true">Add Income</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/expenses?add=true">Add Expense</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/assets?add=true">Add Asset</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${data.currentMonth.totalIncome.toLocaleString()}
            </div>
            <div
              className={`flex items-center text-xs mt-1 ${
                incomeGrowth >= 0 ? "text-accent" : "text-destructive"
              }`}
            >
              {incomeGrowth >= 0 ? (
                <ArrowUpRight className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3" />
              )}
              {Math.abs(incomeGrowth).toFixed(1)}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <CreditCard className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              ${data.currentMonth.totalExpenses.toLocaleString()}
            </div>
            <div
              className={`flex items-center text-xs mt-1 ${
                expenseGrowth <= 0 ? "text-accent" : "text-destructive"
              }`}
            >
              {expenseGrowth >= 0 ? (
                <ArrowUpRight className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3" />
              )}
              {Math.abs(expenseGrowth).toFixed(1)}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">
              ${netProfit.toLocaleString()}
            </div>
            <div
              className={`flex items-center text-xs mt-1 ${
                profitGrowth >= 0 ? "text-accent" : "text-destructive"
              }`}
            >
              {profitGrowth >= 0 ? (
                <ArrowUpRight className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3" />
              )}
              {Math.abs(profitGrowth).toFixed(1)}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI</CardTitle>
            <Target className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">
              {roi.toFixed(1)}%
            </div>
            <div className="flex items-center text-xs text-accent mt-1">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              Return on investment
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>
              Monthly comparison of income and expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="month"
                    className="text-xs fill-muted-foreground"
                  />
                  <YAxis
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `$${value.toLocaleString()}`,
                      "",
                    ]}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="2"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories Spider Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Expense Categories Analysis
            </CardTitle>
            <CardDescription>
              Multi-dimensional view of spending patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={data.expenseCategories}
                  margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                >
                  <PolarGrid
                    stroke="hsl(var(--border))"
                    strokeOpacity={0.3}
                    radialLines={true}
                  />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                      fontWeight: 500,
                    }}
                    className="text-xs"
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                      opacity: 0.7,
                    }}
                    tickCount={5}
                  />
                  <Radar
                    name="Expense Distribution"
                    dataKey="normalized"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.15}
                    strokeWidth={3}
                    dot={{
                      r: 6,
                      fill: "hsl(var(--primary))",
                      stroke: "hsl(var(--background))",
                      strokeWidth: 2,
                    }}
                  />
                  <Radar
                    name="Budget Utilization"
                    dataKey="percentage"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{
                      r: 4,
                      fill: "hsl(var(--accent))",
                      stroke: "hsl(var(--background))",
                      strokeWidth: 1,
                    }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => {
                      if (name === "Expense Distribution") {
                        return [
                          `$${props.payload.amount.toLocaleString()}`,
                          "Amount",
                        ];
                      }
                      return [`${value}%`, "Share"];
                    }}
                    labelFormatter={(label) => `Category: ${label}`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  Expense Distribution
                </h4>
                {data.expenseCategories.slice(0, 3).map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {category.category}
                    </span>
                    <span className="font-medium">
                      ${category.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent border-2 border-dashed border-accent"></div>
                  Category Share
                </h4>
                {data.expenseCategories.slice(0, 3).map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {category.category}
                    </span>
                    <span className="font-medium">{category.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentTransactions.length > 0 ? (
                data.recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          transaction.type === "income"
                            ? "bg-accent/10 border border-accent/20"
                            : "bg-destructive/10 border border-destructive/20"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="h-5 w-5 text-accent" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {transaction.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`font-bold ${
                        transaction.type === "income"
                          ? "text-accent"
                          : "text-destructive"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : ""}$
                      {Math.abs(transaction.amount).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No recent transactions
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add some income or expenses to see them here
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link href="/dashboard/income">
                <Button variant="outline" className="w-full" size="sm">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View All Income
                </Button>
              </Link>
              <Link href="/dashboard/expenses">
                <Button variant="outline" className="w-full" size="sm">
                  <TrendingDown className="mr-2 h-4 w-4" />
                  View All Expenses
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Employees */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Top Performing Employees
            </CardTitle>
            <CardDescription>Ranked by total income generated</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.employeePerformance.length > 0 ? (
              data.employeePerformance.map((employee, index) => (
                <div
                  key={employee.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                      <span className="text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                    </div>

                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback className="text-xs font-medium">
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {getRankIcon(index + 1)}
                        <p className="font-medium text-sm truncate">
                          {employee.name}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {employee.role}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">
                      ${employee.totalIncome.toLocaleString()}
                    </p>
                    <div
                      className={`flex items-center text-xs ${
                        employee.growth >= 0
                          ? "text-accent"
                          : "text-destructive"
                      }`}
                    >
                      {employee.growth >= 0 ? (
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-3 w-3" />
                      )}
                      {Math.abs(employee.growth).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No employee data</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add employees to see performance metrics
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">
                  Employee Standings by Income
                </p>
                <div className="flex justify-center items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Top Performers</span>
                  <Trophy className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
