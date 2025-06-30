'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
  Crown
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsePieChart, Cell } from 'recharts';
import { dataStore } from '@/lib/data-store';
import Link from 'next/link';

// Calculate current month data
const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();
const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
const endOfMonth = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0];
const endOfLastMonth = new Date(currentYear, currentMonth, 0).toISOString().split('T')[0];

// Get data from store
const totalIncome = dataStore.getTotalIncome();
const totalExpenses = dataStore.getTotalExpenses();
const currentMonthIncome = dataStore.getTotalIncome(startOfMonth, endOfMonth);
const currentMonthExpenses = dataStore.getTotalExpenses(startOfMonth, endOfMonth);
const lastMonthIncome = dataStore.getTotalIncome(startOfLastMonth, endOfLastMonth);
const lastMonthExpenses = dataStore.getTotalExpenses(startOfLastMonth, endOfLastMonth);

const netProfit = currentMonthIncome - currentMonthExpenses;
const roi = currentMonthExpenses > 0 ? (netProfit / currentMonthExpenses) * 100 : 0;

// Calculate growth percentages
const incomeGrowth = lastMonthIncome > 0 ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;
const expenseGrowth = lastMonthExpenses > 0 ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;
const profitGrowth = lastMonthIncome - lastMonthExpenses > 0 ? ((netProfit - (lastMonthIncome - lastMonthExpenses)) / (lastMonthIncome - lastMonthExpenses)) * 100 : 0;

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000 },
  { month: 'Feb', revenue: 52000, expenses: 35000 },
  { month: 'Mar', revenue: 48000, expenses: 38000 },
  { month: 'Apr', revenue: 61000, expenses: 42000 },
  { month: 'May', revenue: 55000, expenses: 39000 },
  { month: 'Jun', revenue: currentMonthIncome, expenses: currentMonthExpenses },
];

// Enhanced expense categories with icons and analytics
const expenseCategories = [
  { name: 'Software', icon: '💻', color: 'hsl(var(--chart-1))', budget: 5000, spent: 2450 },
  { name: 'Marketing', icon: '📢', color: 'hsl(var(--chart-2))', budget: 8000, spent: 6200 },
  { name: 'Operations', icon: '⚙️', color: 'hsl(var(--chart-3))', budget: 3000, spent: 1850 },
  { name: 'Equipment', icon: '🖥️', color: 'hsl(var(--chart-4))', budget: 4000, spent: 3200 },
  { name: 'Travel', icon: '✈️', color: 'hsl(var(--chart-5))', budget: 2000, spent: 850 },
];

// Get expense breakdown by category
const expenseTransactions = dataStore.getExpenseTransactions();
const expenseByCategory = expenseTransactions.reduce((acc, transaction) => {
  acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
  return acc;
}, {} as Record<string, number>);

const categoryData = Object.entries(expenseByCategory).map(([name, value], index) => ({
  name,
  value: Math.round((value / totalExpenses) * 100),
  amount: value,
  color: `hsl(var(--chart-${(index % 5) + 1}))`
}));

// Get recent transactions
const allTransactions = [
  ...dataStore.getIncomeTransactions().map(t => ({ ...t, type: 'income' as const })),
  ...dataStore.getExpenseTransactions().map(t => ({ ...t, type: 'expense' as const, amount: -t.amount }))
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

// Top performing employees data
const employees = dataStore.getEmployees();
const incomeTransactions = dataStore.getIncomeTransactions();

const employeePerformance = employees.map(employee => {
  const employeeIncome = incomeTransactions
    .filter(t => t.employeeId === employee.id)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const employeeTransactions = incomeTransactions.filter(t => t.employeeId === employee.id).length;
  
  const lastMonthIncome = incomeTransactions
    .filter(t => t.employeeId === employee.id && t.date >= startOfLastMonth && t.date <= endOfLastMonth)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const currentMonthIncome = incomeTransactions
    .filter(t => t.employeeId === employee.id && t.date >= startOfMonth && t.date <= endOfMonth)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const growth = lastMonthIncome > 0 ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;
  
  return {
    ...employee,
    totalIncome: employeeIncome,
    transactions: employeeTransactions,
    currentMonthIncome,
    growth,
    avgPerTransaction: employeeTransactions > 0 ? employeeIncome / employeeTransactions : 0
  };
}).sort((a, b) => b.totalIncome - a.totalIncome).slice(0, 5);

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Crown className="h-4 w-4 text-yellow-500" />;
    case 2: return <Medal className="h-4 w-4 text-gray-400" />;
    case 3: return <Award className="h-4 w-4 text-amber-600" />;
    default: return <Star className="h-4 w-4 text-muted-foreground" />;
  }
};

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back! Here's what's happening with your finances.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/dashboard/income?add=true">
            <Button size="sm" className="group relative overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95">
              <span className="relative z-10 flex items-center">
                <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
                Add
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity group-hover:opacity-20" />
            </Button>
          </Link>
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
            <div className="text-2xl font-bold text-primary">${currentMonthIncome.toLocaleString()}</div>
            <div className={`flex items-center text-xs mt-1 ${incomeGrowth >= 0 ? 'text-accent' : 'text-destructive'}`}>
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
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">${currentMonthExpenses.toLocaleString()}</div>
            <div className={`flex items-center text-xs mt-1 ${expenseGrowth <= 0 ? 'text-accent' : 'text-destructive'}`}>
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
            <div className="text-2xl font-bold text-chart-3">${netProfit.toLocaleString()}</div>
            <div className={`flex items-center text-xs mt-1 ${profitGrowth >= 0 ? 'text-accent' : 'text-destructive'}`}>
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
            <div className="text-2xl font-bold text-chart-4">{roi.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-accent mt-1">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              Return on investment
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Expense Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories Performance</CardTitle>
          <CardDescription>
            Budget vs actual spending by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenseCategories.map((category, index) => {
              const percentage = (category.spent / category.budget) * 100;
              const isOverBudget = percentage > 100;
              
              return (
                <div key={category.name} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{category.icon}</div>
                    <div>
                      <p className="font-medium text-foreground">{category.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${category.spent.toLocaleString()} / ${category.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24">
                      <Progress 
                        value={Math.min(percentage, 100)} 
                        className={`h-2 ${isOverBudget ? 'bg-destructive/20' : ''}`}
                      />
                    </div>
                    <Badge variant={isOverBudget ? 'destructive' : percentage > 80 ? 'secondary' : 'default'}>
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

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
                <AreaChart data={revenueData}>
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
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
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

        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>
              Breakdown of expenses by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsePieChart>
                  <RechartsePieChart 
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsePieChart>
                  <Tooltip 
                    formatter={(value: number, name: string, props: any) => [`${value}% ($${props.payload.amount.toLocaleString()})`, 'Share']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </RechartsePieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-muted-foreground">{category.name}</span>
                  </div>
                  <span className="font-medium">{category.value}%</span>
                </div>
              ))}
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
            <CardDescription>
              Your latest financial activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      transaction.type === 'income' 
                        ? 'bg-accent/10 border border-accent/20' 
                        : 'bg-destructive/10 border border-destructive/20'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="h-5 w-5 text-accent" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.name}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${
                    transaction.type === 'income' ? 'text-accent' : 'text-destructive'
                  }`}>
                    {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/dashboard/analytics">
                <Button variant="outline" className="w-full">
                  View All Transactions
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
            <CardDescription>
              Ranked by total income generated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {employeePerformance.map((employee, index) => (
              <div 
                key={employee.id} 
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  
                  <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                    <AvatarImage src={employee.avatar} />
                    <AvatarFallback className="text-xs font-medium">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {getRankIcon(index + 1)}
                      <p className="font-medium text-sm truncate">{employee.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{employee.role}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">
                    ${employee.totalIncome.toLocaleString()}
                  </p>
                  <div className={`flex items-center text-xs ${
                    employee.growth >= 0 ? 'text-accent' : 'text-destructive'
                  }`}>
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
            
            <div className="pt-4 border-t border-border">
              <Link href="/dashboard/settings">
                <Button variant="outline" className="w-full" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  View All Employees
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}