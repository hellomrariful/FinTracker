'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  PieChart,
  BarChart3,
  Activity,
  Zap,
  Award,
  Crown,
  Medal,
  Star,
  Building,
  Wallet,
  CreditCard,
  Users,
  Globe,
  Filter,
  Eye,
  Layers,
  TrendingUpIcon
} from 'lucide-react';
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
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  Scatter,
  ScatterChart,
  ZAxis,
  FunnelChart,
  Funnel,
  LabelList,
  TreemapChart,
  Treemap
} from 'recharts';
import { dataStore } from '@/lib/data-store';

export default function AnalyticsPage() {
  const [timeFrame, setTimeFrame] = useState('last-month');
  const [activeTab, setActiveTab] = useState('overview');

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

  // Get comprehensive data
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

  // Get comprehensive analytics data
  const employees = dataStore.getEmployees();
  const incomeTransactions = dataStore.getIncomeTransactions();
  const expenseTransactions = dataStore.getExpenseTransactions();
  const cashFlowData = dataStore.getCashFlow(12);

  // Enhanced revenue vs expenses data
  const revenueVsExpensesData = cashFlowData.map(item => ({
    month: item.month,
    revenue: item.income,
    expenses: item.expenses,
    profit: item.netFlow,
    profitMargin: item.income > 0 ? (item.netFlow / item.income) * 100 : 0
  }));

  // Income by category with enhanced data
  const incomeByCategory = incomeTransactions
    .filter(t => {
      const date = new Date(t.date);
      return date >= new Date(startDate) && date <= new Date(endDate);
    })
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const incomeCategoryData = Object.entries(incomeByCategory).map(([name, value], index) => ({
    name,
    value,
    percentage: Math.round((value / totalIncome) * 100),
    color: `hsl(var(--chart-${(index % 5) + 1}))`,
    icon: getIconForCategory(name)
  }));

  // Expense by category with spider chart data
  const expenseByCategory = expenseTransactions
    .filter(t => {
      const date = new Date(t.date);
      return date >= new Date(startDate) && date <= new Date(endDate);
    })
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const expenseCategoryData = Object.entries(expenseByCategory).map(([name, value], index) => ({
    name,
    value,
    percentage: Math.round((value / totalExpenses) * 100),
    normalized: Math.round((value / Math.max(...Object.values(expenseByCategory))) * 100),
    color: `hsl(var(--chart-${(index % 5) + 1}))`,
    icon: getIconForCategory(name)
  }));

  // Employee performance with comprehensive metrics
  const employeePerformance = employees.map(employee => {
    const employeeIncome = incomeTransactions
      .filter(t => t.employeeId === employee.id && t.date >= startDate && t.date <= endDate)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const employeeTransactions = incomeTransactions
      .filter(t => t.employeeId === employee.id && t.date >= startDate && t.date <= endDate).length;
    
    const efficiency = employee.salary > 0 ? (employeeIncome / employee.salary) * 100 : 0;
    
    return {
      ...employee,
      income: employeeIncome,
      transactions: employeeTransactions,
      efficiency,
      avgPerTransaction: employeeTransactions > 0 ? employeeIncome / employeeTransactions : 0
    };
  }).sort((a, b) => b.income - a.income);

  // Top sources and categories
  const topIncomeSources = Object.entries(
    incomeTransactions
      .filter(t => t.date >= startDate && t.date <= endDate)
      .reduce((acc, t) => {
        acc[t.source] = (acc[t.source] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const topExpenseCategories = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Funnel data for sales pipeline
  const funnelData = [
    { name: 'Leads', value: 1000, fill: 'hsl(var(--chart-1))' },
    { name: 'Qualified', value: 750, fill: 'hsl(var(--chart-2))' },
    { name: 'Proposals', value: 500, fill: 'hsl(var(--chart-3))' },
    { name: 'Negotiations', value: 300, fill: 'hsl(var(--chart-4))' },
    { name: 'Closed Won', value: 150, fill: 'hsl(var(--chart-5))' }
  ];

  // Scatter plot data for expense vs revenue correlation
  const scatterData = employees.map(employee => {
    const income = employeePerformance.find(p => p.id === employee.id)?.income || 0;
    const expenses = expenseTransactions
      .filter(t => t.employeeId === employee.id && t.date >= startDate && t.date <= endDate)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      x: expenses,
      y: income,
      z: employee.performance,
      name: employee.name,
      department: employee.department
    };
  });

  // Treemap data for department revenue
  const departmentRevenue = employees.reduce((acc, employee) => {
    const income = employeePerformance.find(p => p.id === employee.id)?.income || 0;
    if (!acc[employee.department]) {
      acc[employee.department] = { name: employee.department, value: 0, children: [] };
    }
    acc[employee.department].value += income;
    acc[employee.department].children.push({
      name: employee.name,
      value: income,
      role: employee.role
    });
    return acc;
  }, {} as Record<string, any>);

  const treemapData = Object.values(departmentRevenue);

  function getIconForCategory(category: string): string {
    const iconMap: Record<string, string> = {
      'Client Projects': '💼',
      'Consulting': '🎯',
      'Product Sales': '📦',
      'Subscriptions': '🔄',
      'Software': '💻',
      'Marketing': '📢',
      'Operations': '⚙️',
      'Equipment': '🖥️',
      'Travel': '✈️',
      'Office Rent': '🏢',
      'Utilities': '⚡',
      'Salaries': '👥'
    };
    return iconMap[category] || '📊';
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2: return <Medal className="h-4 w-4 text-gray-400" />;
      case 3: return <Award className="h-4 w-4 text-amber-600" />;
      default: return <Star className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleExportPDF = () => {
    alert('PDF export functionality would be implemented here');
  };

  const handleExportCSV = () => {
    alert('CSV export functionality would be implemented here');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl border border-primary/20">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              Advanced Analytics
            </h1>
            <p className="mt-2 text-muted-foreground">
              Comprehensive insights into your financial performance with advanced visualizations.
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

        {/* Enhanced Key Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -translate-y-10 translate-x-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
              <div className="p-2 bg-primary/20 rounded-lg">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
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
              <Progress value={Math.abs(revenueGrowth)} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-chart-3/10 rounded-full -translate-y-10 translate-x-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              <div className="p-2 bg-chart-3/20 rounded-lg">
                <Target className="h-4 w-4 text-chart-3" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">{profitMargin.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                ${netProfit.toLocaleString()} profit
              </p>
              <Progress value={profitMargin} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-full -translate-y-10 translate-x-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <div className="p-2 bg-accent/20 rounded-lg">
                <DollarSign className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">${totalIncome.toLocaleString()}</div>
              <div className={`flex items-center text-xs mt-1 ${profitGrowth >= 0 ? 'text-accent' : 'text-destructive'}`}>
                {profitGrowth >= 0 ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )}
                {Math.abs(profitGrowth).toFixed(1)}% vs previous
              </div>
              <Progress value={75} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-chart-4/10 rounded-full -translate-y-10 translate-x-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROI</CardTitle>
              <div className="p-2 bg-chart-4/20 rounded-lg">
                <Zap className="h-4 w-4 text-chart-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-4">{roi.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Return on investment
              </p>
              <Progress value={roi} className="mt-3 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="overview" className="flex items-center gap-2 rounded-lg">
              <Eye className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2 rounded-lg">
              <TrendingUpIcon className="h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2 rounded-lg">
              <CreditCard className="h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2 rounded-lg">
              <Users className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2 rounded-lg">
              <Layers className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Enhanced Revenue vs Expenses Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Revenue vs Expenses Trend
                  </CardTitle>
                  <CardDescription>
                    Comprehensive financial performance over time with profit margins
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={revenueVsExpensesData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
                        <YAxis 
                          yAxisId="left"
                          className="text-xs fill-muted-foreground"
                          tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right"
                          className="text-xs fill-muted-foreground"
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => {
                            if (name === 'profitMargin') return [`${value.toFixed(1)}%`, 'Profit Margin'];
                            return [`$${value.toLocaleString()}`, name];
                          }}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Area 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="revenue" 
                          fill="hsl(var(--primary))"
                          fillOpacity={0.1}
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                        />
                        <Area 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="expenses" 
                          fill="hsl(var(--destructive))"
                          fillOpacity={0.1}
                          stroke="hsl(var(--destructive))"
                          strokeWidth={3}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="profitMargin" 
                          stroke="hsl(var(--accent))"
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 6 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Income by Category Treemap */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Revenue by Department
                  </CardTitle>
                  <CardDescription>
                    Hierarchical view of revenue generation by department and employee
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <Treemap
                        data={treemapData}
                        dataKey="value"
                        aspectRatio={4/3}
                        stroke="hsl(var(--border))"
                        strokeWidth={2}
                        fill="hsl(var(--primary))"
                      >
                        <Tooltip 
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                      </Treemap>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Income Sources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-accent" />
                    Top Revenue Sources
                  </CardTitle>
                  <CardDescription>
                    Highest revenue generating sources with growth indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topIncomeSources.map(([source, amount], index) => (
                      <div key={source} className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                            <span className="text-sm font-bold text-primary">{index + 1}</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground">{source}</span>
                            <div className="text-xs text-muted-foreground">
                              {((amount / totalIncome) * 100).toFixed(1)}% of total revenue
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="text-lg font-bold">
                            ${amount.toLocaleString()}
                          </Badge>
                          <div className="text-xs text-accent mt-1 flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +12.5%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Enhanced Spider Chart for Expenses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Expense Categories Spider Analysis
                  </CardTitle>
                  <CardDescription>
                    Multi-dimensional view of spending patterns and budget utilization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={expenseCategoryData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                        <PolarGrid 
                          stroke="hsl(var(--border))" 
                          strokeOpacity={0.3}
                          radialLines={true}
                        />
                        <PolarAngleAxis 
                          dataKey="name" 
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
                          name="Expense Amount"
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
                          name="Category Share"
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
                            if (name === 'Expense Amount') {
                              return [`$${props.payload.value.toLocaleString()}`, 'Amount'];
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
                      {expenseCategoryData.slice(0, 3).map((category, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <span>{category.icon}</span>
                            {category.name}
                          </span>
                          <span className="font-medium">${category.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-accent border-2 border-dashed border-accent"></div>
                        Category Share
                      </h4>
                      {expenseCategoryData.slice(0, 3).map((category, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            <span>{category.icon}</span>
                            {category.name}
                          </span>
                          <span className="font-medium">{category.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Expense Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-destructive" />
                    Top Expense Categories
                  </CardTitle>
                  <CardDescription>
                    Highest spending categories with budget analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topExpenseCategories.map(([category, amount], index) => (
                      <div key={category} className="flex items-center justify-between p-4 bg-gradient-to-r from-destructive/5 to-transparent rounded-lg border border-destructive/10">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 border border-destructive/20">
                            <span className="text-sm font-bold text-destructive">{index + 1}</span>
                          </div>
                          <div>
                            <span className="font-medium text-foreground flex items-center gap-2">
                              <span>{getIconForCategory(category)}</span>
                              {category}
                            </span>
                            <div className="text-xs text-muted-foreground">
                              {((amount / totalExpenses) * 100).toFixed(1)}% of total expenses
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive" className="text-lg font-bold">
                            ${amount.toLocaleString()}
                          </Badge>
                          <div className="text-xs text-destructive mt-1 flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +8.2%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Employee Performance Scatter Plot */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Employee Performance Matrix
                  </CardTitle>
                  <CardDescription>
                    Revenue vs Expenses correlation by employee performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={scatterData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          type="number" 
                          dataKey="x" 
                          name="Expenses"
                          className="text-xs fill-muted-foreground"
                          tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="y" 
                          name="Revenue"
                          className="text-xs fill-muted-foreground"
                          tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <ZAxis type="number" dataKey="z" range={[50, 400]} />
                        <Tooltip 
                          formatter={(value: number, name: string, props: any) => {
                            if (name === 'Revenue') return [`$${value.toLocaleString()}`, 'Revenue'];
                            if (name === 'Expenses') return [`$${value.toLocaleString()}`, 'Expenses'];
                            return [value, name];
                          }}
                          labelFormatter={(label, payload) => {
                            if (payload && payload[0]) {
                              return `${payload[0].payload.name} (${payload[0].payload.department})`;
                            }
                            return label;
                          }}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Scatter 
                          name="Employees" 
                          data={scatterData} 
                          fill="hsl(var(--primary))"
                          fillOpacity={0.7}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Employees */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Top Performing Employees
                  </CardTitle>
                  <CardDescription>
                    Ranked by revenue generation and efficiency metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employeePerformance.slice(0, 5).map((employee, index) => (
                      <div key={employee.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
                            {getRankIcon(index + 1)}
                          </div>
                          <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                            <AvatarImage src={employee.avatar} />
                            <AvatarFallback className="text-xs font-medium">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.role}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {employee.department}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {employee.efficiency.toFixed(1)}% ROI
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-lg font-bold text-primary">
                            ${employee.income.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {employee.transactions} transactions
                          </p>
                          <p className="text-xs text-accent">
                            ${employee.avgPerTransaction.toLocaleString()} avg
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Sales Funnel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Sales Funnel Analysis
                  </CardTitle>
                  <CardDescription>
                    Conversion rates through the sales pipeline
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <FunnelChart>
                        <Tooltip 
                          formatter={(value: number) => [`${value.toLocaleString()}`, 'Count']}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Funnel
                          dataKey="value"
                          data={funnelData}
                          isAnimationActive
                        >
                          <LabelList position="center" fill="#fff" stroke="none" />
                        </Funnel>
                      </FunnelChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {funnelData.map((stage, index) => (
                      <div key={stage.name} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{stage.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{stage.value.toLocaleString()}</span>
                          {index > 0 && (
                            <span className="text-xs text-muted-foreground">
                              ({((stage.value / funnelData[index - 1].value) * 100).toFixed(1)}%)
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cash Flow Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-accent" />
                    Cash Flow Analysis
                  </CardTitle>
                  <CardDescription>
                    Monthly cash flow trends and projections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cashFlowData}>
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
                        <Area 
                          type="monotone" 
                          dataKey="netFlow" 
                          stroke="hsl(var(--accent))"
                          fill="hsl(var(--accent))"
                          fillOpacity={0.3}
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                      <p className="text-sm text-muted-foreground">Avg Monthly</p>
                      <p className="text-lg font-bold text-accent">
                        ${(cashFlowData.reduce((sum, item) => sum + item.netFlow, 0) / cashFlowData.length).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground">Best Month</p>
                      <p className="text-lg font-bold text-primary">
                        ${Math.max(...cashFlowData.map(item => item.netFlow)).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-chart-3/10 rounded-lg border border-chart-3/20">
                      <p className="text-sm text-muted-foreground">Growth Rate</p>
                      <p className="text-lg font-bold text-chart-3">+12.5%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}