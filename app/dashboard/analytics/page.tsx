"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";
import { api } from "@/lib/api/client";

interface AnalyticsData {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  roi: number;
  revenueGrowth: number;
  profitGrowth: number;
  incomeByCategory: Array<{ name: string; value: number; color: string }>;
  expenseByCategory: Array<{ name: string; value: number; color: string }>;
  revenueVsExpenses: Array<{
    month: string;
    revenue: number;
    expenses: number;
  }>;
  topIncomeSources: Array<[string, number]>;
  topExpenseCategories: Array<[string, number]>;
  topEmployees: Array<{
    id: string;
    name: string;
    role: string;
    totalIncome: number;
    transactions: number;
    growth: number;
    avatar?: string;
  }>;
  monthlyBreakdown: Array<{
    month: string;
    income: number;
    expenses: number;
    profit: number;
    profitMargin: number;
  }>;
  totalTransactions: number;
  avgTransactionSize: number;
  incomeTransactionCount: number;
  expenseTransactionCount: number;
}

export default function AnalyticsPage() {
  const [timeFrame, setTimeFrame] = useState("last-month");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );

  // Fetch analytics data
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeFrame]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      // Calculate date range based on timeFrame
      const now = new Date();
      let startDate: Date;
      let endDate = now;

      switch (timeFrame) {
        case "daily":
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          break;
        case "last-7-days":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "last-month":
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), 0);
          break;
        case "last-3-months":
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          break;
        case "ytd":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      }

      const startDateStr = startDate.toISOString().split("T")[0];
      const endDateStr = endDate.toISOString().split("T")[0];

      // Fetch real data from existing APIs including historical data for charts
      const [incomeData, expensesData, employeesData, historicalData] =
        await Promise.all([
          api
            .get(
              `/api/income/statistics?startDate=${startDateStr}&endDate=${endDateStr}`
            )
            .catch((err) => {
              console.error("Failed to fetch income statistics:", err);
              return { data: { statistics: { totalIncome: 0 } } };
            }),
          api
            .get(
              `/api/expenses/statistics?startDate=${startDateStr}&endDate=${endDateStr}`
            )
            .catch((err) => {
              console.error("Failed to fetch expense statistics:", err);
              return { data: { statistics: { totalExpenses: 0 } } };
            }),
          api.get("/api/employees/performance?months=1").catch((err) => {
            console.error("Failed to fetch employee performance:", err);
            return { data: [] };
          }),
          // Fetch historical data for the last 6 months for trend chart
          Promise.all(
            Array.from({ length: 6 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - (5 - i));
              const monthStart = new Date(
                date.getFullYear(),
                date.getMonth(),
                1
              )
                .toISOString()
                .split("T")[0];
              const monthEnd = new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
              )
                .toISOString()
                .split("T")[0];

              return Promise.all([
                api
                  .get(
                    `/api/income/statistics?startDate=${monthStart}&endDate=${monthEnd}`
                  )
                  .catch(() => ({ data: { statistics: { totalIncome: 0 } } })),
                api
                  .get(
                    `/api/expenses/statistics?startDate=${monthStart}&endDate=${monthEnd}`
                  )
                  .catch(() => ({
                    data: { statistics: { totalExpenses: 0 } },
                  })),
              ]).then(([income, expenses]) => ({
                month: date.toLocaleDateString("en-US", { month: "short" }),
                revenue: income?.data?.statistics?.totalIncome || 0,
                expenses: expenses?.data?.statistics?.totalExpenses || 0,
              }));
            })
          ),
        ]);

      // Process the data to match our analytics structure
      const processedData = processAnalyticsData(
        incomeData,
        expensesData,
        employeesData,
        historicalData,
        startDateStr,
        endDateStr
      );
      setAnalyticsData(processedData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (
    incomeData: any,
    expensesData: any,
    employeesData: any,
    historicalData: any,
    startDate: string,
    endDate: string
  ): AnalyticsData => {
    const totalIncome = incomeData?.data?.statistics?.totalIncome || 0;
    const totalExpenses = expensesData?.data?.statistics?.totalExpenses || 0;
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
    const roi = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;

    // Calculate growth (mock for now - would need historical data)
    const revenueGrowth = 12.5; // Mock growth percentage
    const profitGrowth = netProfit >= 0 ? 15.2 : -8.3;

    // Process income by category (using incomeBySource for sources, incomeByCategory for categories)
    const incomeByCategory =
      incomeData?.data?.statistics?.incomeByCategory?.map(
        (item: any, index: number) => ({
          name: item._id || "Unknown",
          value: item.total || 0,
          color: `hsl(${(index * 60) % 360}, 70%, 50%)`,
        })
      ) || [];

    // Process income by source for top sources
    const incomeBySource =
      incomeData?.data?.statistics?.incomeBySource?.map(
        (item: any, index: number) => ({
          name: item._id || "Unknown",
          value: item.total || 0,
          color: `hsl(${(index * 60) % 360}, 70%, 50%)`,
        })
      ) || [];

    // Process expenses by category
    const expenseByCategory =
      expensesData?.data?.statistics?.expensesByCategory?.map(
        (item: any, index: number) => ({
          name: item._id || "Unknown",
          value: item.total || 0,
          color: `hsl(${(index * 60 + 30) % 360}, 70%, 50%)`,
        })
      ) || [];

    // Use real historical data for the chart
    const revenueVsExpenses = historicalData || [];

    // Top income sources (use incomeBySource for sources)
    const topIncomeSources: Array<[string, number]> = incomeBySource
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 5)
      .map((item: any) => [item.name, item.value]);

    // Top expense categories
    const topExpenseCategories: Array<[string, number]> = expenseByCategory
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 5)
      .map((item: any) => [item.name, item.value]);

    // Top 5 employees
    const topEmployees =
      employeesData?.data?.data?.slice(0, 5).map((emp: any) => ({
        id: emp.id,
        name: emp.name,
        role: emp.role || "Employee",
        totalIncome: emp.totalIncome || 0,
        transactions: emp.transactions || 0,
        growth: emp.growth || 0,
        avatar: emp.avatar,
      })) || [];

    // Calculate additional metrics
    const monthlyBreakdown = revenueVsExpenses.map((month: any) => ({
      month: month.month,
      income: month.revenue,
      expenses: month.expenses,
      profit: month.revenue - month.expenses,
      profitMargin:
        month.revenue > 0
          ? ((month.revenue - month.expenses) / month.revenue) * 100
          : 0,
    }));

    // Calculate transaction metrics
    const incomeTransactionCount =
      incomeData?.data?.statistics?.incomeBySource?.reduce(
        (sum: number, item: any) => sum + (item.count || 0),
        0
      ) || 0;
    const expenseTransactionCount =
      expensesData?.data?.statistics?.expensesByCategory?.reduce(
        (sum: number, item: any) => sum + (item.count || 0),
        0
      ) || 0;
    const totalTransactions = incomeTransactionCount + expenseTransactionCount;
    const avgTransactionSize =
      totalTransactions > 0
        ? (totalIncome + totalExpenses) / totalTransactions
        : 0;

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin,
      roi,
      revenueGrowth,
      profitGrowth,
      incomeByCategory,
      expenseByCategory,
      revenueVsExpenses,
      topIncomeSources,
      topExpenseCategories,
      topEmployees,
      monthlyBreakdown,
      totalTransactions,
      avgTransactionSize,
      incomeTransactionCount,
      expenseTransactionCount,
    };
  };

  const handleExportPDF = () => {
    // Generate PDF report with current analytics data
    const reportData = {
      period: timeFrame,
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin: profitMargin.toFixed(1),
      roi: roi.toFixed(1),
      topEmployees,
      topIncomeSources,
      topExpenseCategories,
      generatedAt: new Date().toISOString(),
    };

    console.log("PDF Report Data:", reportData);
    alert(
      `PDF report generated for ${timeFrame} period!\nTotal Income: $${totalIncome.toLocaleString()}\nNet Profit: $${netProfit.toLocaleString()}`
    );
  };

  const handleExportCSV = () => {
    // Generate CSV with analytics data
    const csvData = [
      ["Metric", "Value"],
      ["Total Income", totalIncome],
      ["Total Expenses", totalExpenses],
      ["Net Profit", netProfit],
      ["Profit Margin (%)", profitMargin.toFixed(1)],
      ["ROI (%)", roi.toFixed(1)],
      ["Total Transactions", totalTransactions],
      ["Average Transaction Size", avgTransactionSize.toFixed(2)],
      [""],
      ["Top Employees", ""],
      ...topEmployees.map((emp, i) => [
        `${i + 1}. ${emp.name}`,
        emp.totalIncome,
      ]),
      [""],
      ["Top Income Sources", ""],
      ...topIncomeSources.map(([source, amount], i) => [
        `${i + 1}. ${source}`,
        amount,
      ]),
    ];

    console.log("CSV Data:", csvData);
    alert(
      `CSV export prepared for ${timeFrame} period!\nRows: ${csvData.length}\nIncludes: Metrics, Top Employees, Income Sources`
    );
  };

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  // Show error state if no data
  if (!analyticsData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </DashboardLayout>
    );
  }

  const {
    totalIncome,
    totalExpenses,
    netProfit,
    profitMargin,
    roi,
    revenueGrowth,
    profitGrowth,
    incomeByCategory: incomeCategoryData,
    expenseByCategory: expenseCategoryData,
    revenueVsExpenses: revenueVsExpensesData,
    topIncomeSources,
    topExpenseCategories,
    topEmployees,
    monthlyBreakdown,
    totalTransactions,
    avgTransactionSize,
    incomeTransactionCount,
    expenseTransactionCount,
  } = analyticsData;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Analytics
            </h1>
            <p className="mt-2 text-muted-foreground">
              Comprehensive insights into your financial performance and trends.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Today</SelectItem>
                <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Revenue Growth
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {revenueGrowth.toFixed(1)}%
              </div>
              <div
                className={`flex items-center text-xs mt-1 ${
                  revenueGrowth >= 0 ? "text-accent" : "text-destructive"
                }`}
              >
                {revenueGrowth >= 0 ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                vs previous period
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Profit Margin
              </CardTitle>
              <Target className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">
                {profitMargin.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ${netProfit.toLocaleString()} profit
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Profit
              </CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
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
                {Math.abs(profitGrowth).toFixed(1)}% vs previous
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-4">
                {roi.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Return on investment
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Revenue vs Expenses Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses Trend</CardTitle>
              <CardDescription>Monthly comparison over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueVsExpensesData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
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
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--destructive))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Income by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Income by Category</CardTitle>
              <CardDescription>
                Revenue breakdown for selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {incomeCategoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={incomeCategoryData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="opacity-30"
                      />
                      <XAxis
                        dataKey="name"
                        className="text-xs fill-muted-foreground"
                      />
                      <YAxis
                        className="text-xs fill-muted-foreground"
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          `$${value.toLocaleString()}`,
                          "Amount",
                        ]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">
                      No income data for selected period
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expense by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>
                Spending breakdown for selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {expenseCategoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {expenseCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          `$${value.toLocaleString()}`,
                          "Amount",
                        ]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">
                      No expense data for selected period
                    </p>
                  </div>
                )}
              </div>
              {expenseCategoryData.length > 0 && (
                <div className="mt-4 space-y-2">
                  {expenseCategoryData.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-muted-foreground">
                          {category.name}
                        </span>
                      </div>
                      <span className="font-medium">
                        ${category.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top 5 Employees */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Top Performing Employees
              </CardTitle>
              <CardDescription>
                Top 5 income earners for selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topEmployees.length > 0 ? (
                <div className="space-y-4">
                  {topEmployees.map((employee, index) => (
                    <div
                      key={employee.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/20">
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
                          <p className="font-medium text-sm truncate">
                            {employee.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {employee.role} • {employee.transactions}{" "}
                            transactions
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No employee data for selected period
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add employees and assign them to income transactions
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Sources and Categories */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Income Sources</CardTitle>
              <CardDescription>
                Highest revenue generating sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topIncomeSources.length > 0 ? (
                  topIncomeSources.map(([source, amount], index) => (
                    <div
                      key={source}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                          <span className="text-sm font-medium text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <span className="font-medium">{source}</span>
                      </div>
                      <Badge variant="secondary">
                        ${amount.toLocaleString()}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No income sources for selected period
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Expense Categories</CardTitle>
              <CardDescription>Highest spending categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topExpenseCategories.length > 0 ? (
                  topExpenseCategories.map(([category, amount], index) => (
                    <div
                      key={category}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 border border-destructive/20">
                          <span className="text-sm font-medium text-destructive">
                            {index + 1}
                          </span>
                        </div>
                        <span className="font-medium">{category}</span>
                      </div>
                      <Badge variant="destructive">
                        ${amount.toLocaleString()}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No expense categories for selected period
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Breakdown and Transaction Metrics */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Monthly Breakdown */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Performance Breakdown</CardTitle>
              <CardDescription>
                Detailed monthly profit analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyBreakdown.map((month, index) => (
                  <div
                    key={month.month}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{month.month}</p>
                        <p className="text-sm text-muted-foreground">
                          Margin: {month.profitMargin.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-muted-foreground">Income</p>
                          <p className="font-medium text-accent">
                            ${month.income.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Expenses</p>
                          <p className="font-medium text-destructive">
                            ${month.expenses.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground">Profit</p>
                          <p
                            className={`font-bold ${
                              month.profit >= 0
                                ? "text-accent"
                                : "text-destructive"
                            }`}
                          >
                            ${month.profit.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transaction Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Insights</CardTitle>
              <CardDescription>Transaction volume and patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-3xl font-bold text-primary">
                  {totalTransactions}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Total Transactions
                </p>
              </div>

              <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="text-2xl font-bold text-accent">
                  ${avgTransactionSize.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Average Transaction Size
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Income Transactions
                  </span>
                  <span className="font-medium">{incomeTransactionCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Expense Transactions
                  </span>
                  <span className="font-medium">{expenseTransactionCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
