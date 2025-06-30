'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  User
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dataStore } from '@/lib/data-store';

export default function AnalyticsPage() {
  const [timeFrame, setTimeFrame] = useState('last-month');

  // Calculate date ranges based on timeframe
  const getDateRange = (frame: string) => {
    const now = new Date();
    let startDate: string, endDate: string;

    switch (frame) {
      case 'daily':
        startDate = endDate = now.toISOString().split('T')[0];
        break;
      case 'last-7-days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
        break;
      case 'last-month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        startDate = lastMonth.toISOString().split('T')[0];
        endDate = lastMonthEnd.toISOString().split('T')[0];
        break;
      case 'last-3-months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
        break;
      case 'ytd':
        startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
        endDate = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
    }

    return { startDate, endDate };
  };

  const { startDate, endDate } = getDateRange(timeFrame);

  // Get data for selected timeframe
  const totalIncome = dataStore.getTotalIncome(startDate, endDate);
  const totalExpenses = dataStore.getTotalExpenses(startDate, endDate);
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
  const roi = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;

  // Get previous period for comparison
  const getPreviousPeriod = (frame: string) => {
    const now = new Date();
    switch (frame) {
      case 'last-month':
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        const prevMonthEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0);
        return {
          startDate: prevMonth.toISOString().split('T')[0],
          endDate: prevMonthEnd.toISOString().split('T')[0]
        };
      case 'last-3-months':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth() - 6, 1).toISOString().split('T')[0],
          endDate: new Date(now.getFullYear(), now.getMonth() - 3, 0).toISOString().split('T')[0]
        };
      default:
        return { startDate: '', endDate: '' };
    }
  };

  const previousPeriod = getPreviousPeriod(timeFrame);
  const prevIncome = dataStore.getTotalIncome(previousPeriod.startDate, previousPeriod.endDate);
  const prevExpenses = dataStore.getTotalExpenses(previousPeriod.startDate, previousPeriod.endDate);
  const prevProfit = prevIncome - prevExpenses;

  // Calculate growth rates
  const revenueGrowth = prevIncome > 0 ? ((totalIncome - prevIncome) / prevIncome) * 100 : 0;
  const profitGrowth = prevProfit > 0 ? ((netProfit - prevProfit) / prevProfit) * 100 : 0;

  // Get top employee for selected period
  const topEmployee = dataStore.getTopEmployee(startDate, endDate);

  // Generate revenue vs expenses data for the last 6 months
  const generateRevenueVsExpensesData = () => {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    for (let i = 5; i >= 0; i--) {
      const now = new Date();
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
      
      const monthIncome = dataStore.getTotalIncome(monthStart, monthEnd);
      const monthExpenses = dataStore.getTotalExpenses(monthStart, monthEnd);
      
      data.push({
        month: months[5 - i] || date.toLocaleDateString('en-US', { month: 'short' }),
        revenue: monthIncome || 0,
        expenses: monthExpenses || 0
      });
    }
    
    return data;
  };

  const revenueVsExpensesData = generateRevenueVsExpensesData();

  // Get income by category
  const incomeTransactions = dataStore.getIncomeTransactions().filter(t => {
    const date = new Date(t.date);
    return date >= new Date(startDate) && date <= new Date(endDate);
  });

  const incomeByCategory = incomeTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const incomeCategoryData = Object.entries(incomeByCategory).map(([name, value], index) => ({
    name,
    value,
    color: `hsl(var(--chart-${(index % 5) + 1}))`
  }));

  // Get expense by category
  const expenseTransactions = dataStore.getExpenseTransactions().filter(t => {
    const date = new Date(t.date);
    return date >= new Date(startDate) && date <= new Date(endDate);
  });

  const expenseByCategory = expenseTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const expenseCategoryData = Object.entries(expenseByCategory).map(([name, value], index) => ({
    name,
    value,
    color: `hsl(var(--chart-${(index % 5) + 1}))`
  }));

  // Get top sources and categories
  const topIncomeSources = Object.entries(
    incomeTransactions.reduce((acc, t) => {
      acc[t.source] = (acc[t.source] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const topExpenseCategories = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleExportPDF = () => {
    // In a real app, this would generate and download a PDF report
    alert('PDF export functionality would be implemented here');
  };

  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    alert('CSV export functionality would be implemented here');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
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
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{revenueGrowth.toFixed(1)}%</div>
              <div className={`flex items-center text-xs mt-1 ${revenueGrowth >= 0 ? 'text-accent' : 'text-destructive'}`}>
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
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              <Target className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">{profitMargin.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                ${netProfit.toLocaleString()} profit
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">${netProfit.toLocaleString()}</div>
              <div className={`flex items-center text-xs mt-1 ${profitGrowth >= 0 ? 'text-accent' : 'text-destructive'}`}>
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
              <div className="text-2xl font-bold text-chart-4">{roi.toFixed(1)}%</div>
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
              <CardDescription>
                Monthly comparison over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueVsExpensesData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                    <YAxis 
                      className="text-xs fill-muted-foreground"
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--destructive))' }}
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
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                      <YAxis 
                        className="text-xs fill-muted-foreground"
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No income data for selected period</p>
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
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No expense data for selected period</p>
                  </div>
                )}
              </div>
              {expenseCategoryData.length > 0 && (
                <div className="mt-4 space-y-2">
                  {expenseCategoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-muted-foreground">{category.name}</span>
                      </div>
                      <span className="font-medium">${category.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Employee */}
          <Card>
            <CardHeader>
              <CardTitle>Top Employee</CardTitle>
              <CardDescription>
                Highest income contributor for selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topEmployee ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={topEmployee.employee.avatar} />
                      <AvatarFallback>
                        {topEmployee.employee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{topEmployee.employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{topEmployee.employee.role}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="text-2xl font-bold text-primary">
                        ${topEmployee.income.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">Total Income</p>
                    </div>
                    <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <div className="text-2xl font-bold text-accent">
                        {topEmployee.transactions}
                      </div>
                      <p className="text-xs text-muted-foreground">Transactions</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No employee data for selected period</p>
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
                {topIncomeSources.length > 0 ? topIncomeSources.map(([source, amount], index) => (
                  <div key={source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                        <span className="text-sm font-medium text-primary">{index + 1}</span>
                      </div>
                      <span className="font-medium">{source}</span>
                    </div>
                    <Badge variant="secondary">${amount.toLocaleString()}</Badge>
                  </div>
                )) : (
                  <p className="text-center text-muted-foreground py-4">No income sources for selected period</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Expense Categories</CardTitle>
              <CardDescription>
                Highest spending categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topExpenseCategories.length > 0 ? topExpenseCategories.map(([category, amount], index) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 border border-destructive/20">
                        <span className="text-sm font-medium text-destructive">{index + 1}</span>
                      </div>
                      <span className="font-medium">{category}</span>
                    </div>
                    <Badge variant="destructive">${amount.toLocaleString()}</Badge>
                  </div>
                )) : (
                  <p className="text-center text-muted-foreground py-4">No expense categories for selected period</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}