'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  Target,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Receipt,
  FileText,
  Users,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';

interface DashboardAnalyticsProps {
  userId: string;
}

export function DashboardAnalytics({ userId }: DashboardAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({
    summary: {},
    cashFlow: [],
    categoryBreakdown: [],
    budgetStatus: [],
    goals: [],
    recurring: [],
    recentTransactions: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch various analytics data
      const [expenses, income, budgets, goals, recurring] = await Promise.all([
        fetch('/api/expenses').then(res => res.json()),
        fetch('/api/income').then(res => res.json()),
        fetch('/api/budgets').then(res => res.json()),
        fetch('/api/goals').then(res => res.json()),
        fetch('/api/recurring').then(res => res.json()),
      ]);

      // Process data for charts
      const processedData = processAnalyticsData(expenses, income, budgets, goals, recurring);
      setData(processedData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (expenses: any, income: any, budgets: any, goals: any, recurring: any) => {
    // Calculate summary metrics
    const totalIncome = income.reduce((sum: number, i: any) => sum + i.amount, 0);
    const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
    const netIncome = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : '0';

    // Process cash flow data for the last 6 months
    const cashFlowData = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthName = format(date, 'MMM');
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthIncome = income
        .filter((i: any) => {
          const d = new Date(i.date);
          return d >= monthStart && d <= monthEnd;
        })
        .reduce((sum: number, i: any) => sum + i.amount, 0);
      
      const monthExpenses = expenses
        .filter((e: any) => {
          const d = new Date(e.date);
          return d >= monthStart && d <= monthEnd;
        })
        .reduce((sum: number, e: any) => sum + e.amount, 0);

      cashFlowData.push({
        month: monthName,
        income: monthIncome,
        expenses: monthExpenses,
        net: monthIncome - monthExpenses,
      });
    }

    // Category breakdown
    const categoryMap = new Map();
    expenses.forEach((e: any) => {
      const current = categoryMap.get(e.category) || 0;
      categoryMap.set(e.category, current + e.amount);
    });
    
    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Budget status
    const budgetStatus = budgets.map((b: any) => {
      const spent = expenses
        .filter((e: any) => e.category === b.category)
        .reduce((sum: number, e: any) => sum + e.amount, 0);
      
      return {
        name: b.name,
        budget: b.amount,
        spent,
        percentage: (spent / b.amount) * 100,
        status: spent > b.amount ? 'over' : spent > b.amount * 0.8 ? 'warning' : 'good',
      };
    });

    // Goals progress
    const goalsProgress = goals.map((g: any) => ({
      name: g.name,
      progress: (g.currentAmount / g.targetAmount) * 100,
      target: g.targetAmount,
      current: g.currentAmount,
      deadline: g.deadline,
      status: g.status,
    }));

    // Upcoming recurring transactions
    const upcomingRecurring = recurring.upcoming?.slice(0, 5) || [];

    return {
      summary: {
        totalIncome,
        totalExpenses,
        netIncome,
        savingsRate,
        transactionCount: expenses.length + income.length,
        avgTransaction: (totalIncome + totalExpenses) / (expenses.length + income.length),
      },
      cashFlow: cashFlowData,
      categoryBreakdown,
      budgetStatus,
      goals: goalsProgress,
      recurring: upcomingRecurring,
    };
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-20 bg-gray-200" />
            <CardContent className="h-32 bg-gray-100" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${data.summary.totalIncome?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpRight className="inline h-3 w-3" />
              +12.5% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${data.summary.totalExpenses?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              <ArrowDownRight className="inline h-3 w-3" />
              -8.3% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.summary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(data.summary.netIncome)?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Savings Rate: {data.summary.savingsRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.transactionCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: ${data.summary.avgTransaction?.toFixed(2) || '0'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Trend</CardTitle>
          <CardDescription>Income vs Expenses over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.cashFlow}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="expenses" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Top spending categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.categoryBreakdown.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget Status */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Status</CardTitle>
            <CardDescription>Current month budget tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.budgetStatus.map((budget: any) => (
              <div key={budget.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{budget.name}</span>
                  <span className={`font-bold ${
                    budget.status === 'over' ? 'text-red-600' : 
                    budget.status === 'warning' ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    ${budget.spent.toFixed(0)} / ${budget.budget.toFixed(0)}
                  </span>
                </div>
                <Progress 
                  value={Math.min(budget.percentage, 100)} 
                  className={`h-2 ${
                    budget.status === 'over' ? 'bg-red-100' : 
                    budget.status === 'warning' ? 'bg-yellow-100' : 
                    'bg-green-100'
                  }`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Goals Progress</CardTitle>
          <CardDescription>Track your financial goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.goals.map((goal: any) => (
              <div key={goal.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{goal.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${goal.current.toFixed(0)} of ${goal.target.toFixed(0)}
                    </p>
                  </div>
                  <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                    {goal.progress.toFixed(0)}%
                  </Badge>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Recurring Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Recurring</CardTitle>
          <CardDescription>Next recurring transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.recurring.map((transaction: any) => (
              <div key={transaction._id} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{transaction.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.nextDueDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {transaction.frequency}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}