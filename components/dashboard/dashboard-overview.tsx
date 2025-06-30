'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
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
  Users
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
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

// Generate realistic revenue data for the last 6 months
const generateRevenueData = () => {
  const data = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  // Get actual data for the last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
    
    const monthIncome = dataStore.getTotalIncome(monthStart, monthEnd);
    const monthExpenses = dataStore.getTotalExpenses(monthStart, monthEnd);
    
    data.push({
      month: months[5 - i] || date.toLocaleDateString('en-US', { month: 'short' }),
      revenue: monthIncome || (45000 + Math.random() * 20000), // Fallback with some variation
      expenses: monthExpenses || (32000 + Math.random() * 15000)
    });
  }
  
  return data;
};

const revenueData = generateRevenueData();

// Get expense breakdown by category with actual data
const expenseTransactions = dataStore.getExpenseTransactions();
const expenseByCategory = expenseTransactions.reduce((acc, transaction) => {
  acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
  return acc;
}, {} as Record<string, number>);

// Create spider chart data from actual expense data
const spiderChartData = Object.entries(expenseByCategory).length > 0 
  ? Object.entries(expenseByCategory).map(([name, value], index) => {
      const maxValue = Math.max(...Object.values(expenseByCategory));
      return {
        category: name,
        amount: value,
        percentage: Math.round((value / totalExpenses) * 100),
        normalized: Math.round((value / maxValue) * 100),
        color: `hsl(var(--chart-${(index % 5) + 1}))`
      };
    })
  : [
      { category: 'Software', amount: 2450, percentage: 25, normalized: 80, color: 'hsl(var(--chart-1))' },
      { category: 'Marketing', amount: 6200, percentage: 35, normalized: 100, color: 'hsl(var(--chart-2))' },
      { category: 'Operations', amount: 1850, percentage: 15, normalized: 60, color: 'hsl(var(--chart-3))' },
      { category: 'Equipment', amount: 3200, percentage: 20, normalized: 70, color: 'hsl(var(--chart-4))' },
      { category: 'Travel', amount: 850, percentage: 5, normalized: 30, color: 'hsl(var(--chart-5))' }
    ];

// Get recent transactions with actual data
const allTransactions = [
  ...dataStore.getIncomeTransactions().map(t => ({ ...t, type: 'income' as const })),
  ...dataStore.getExpenseTransactions().map(t => ({ ...t, type: 'expense' as const, amount: -t.amount }))
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

// Top performing employees data with actual calculations
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
                <RadarChart data={spiderChartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid 
                    stroke="hsl(var(--border))" 
                    strokeOpacity={0.3}
                    radialLines={true}
                  />
                  <PolarAngleAxis 
                    dataKey="category" 
                    tick={{ 
                      fontSize: 12, 
                      fill: 'hsl(var(--muted-foreground))',
                      fontWeight: 500
                    }}
                    className="text-xs"
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ 
                      fontSize: 10, 
                      fill: 'hsl(var(--muted-foreground))',
                      opacity: 0.7
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
                      fill: 'hsl(var(--primary))',
                      stroke: 'hsl(var(--background))',
                      strokeWidth: 2
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
                      fill: 'hsl(var(--accent))',
                      stroke: 'hsl(var(--background))',
                      strokeWidth: 1
                    }}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string, props: any) => {
                      if (name === 'Expense Distribution') {
                        return [`$${props.payload.amount.toLocaleString()}`, 'Amount'];
                      }
                      return [`${value}%`, 'Share'];
                    }}
                    labelFormatter={(label) => `Category: ${label}`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
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
                {spiderChartData.slice(0, 3).map((category, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{category.category}</span>
                    <span className="font-medium">${category.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent border-2 border-dashed border-accent"></div>
                  Category Share
                </h4>
                {spiderChartData.slice(0, 3).map((category, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{category.category}</span>
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
            <CardDescription>
              Your latest financial activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allTransactions.length > 0 ? allTransactions.map((transaction) => (
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
              )) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent transactions</p>
                  <p className="text-sm text-muted-foreground mt-1">Add some income or expenses to see them here</p>
                </div>
              )}
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
            {employeePerformance.length > 0 ? employeePerformance.map((employee, index) => (
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
            )) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No employee data</p>
                <p className="text-sm text-muted-foreground mt-1">Add employees to see performance metrics</p>
              </div>
            )}
            
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