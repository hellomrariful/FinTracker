'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  AlertCircle,
  Filter,
  Search,
  Edit,
  Trash2,
  Copy,
  RotateCw,
  PieChart,
  Target,
  Bell,
  BellOff
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BudgetForm } from '@/components/dashboard/budget-form';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { api } from '@/lib/api/client';

interface Budget {
  _id: string;
  name: string;
  description?: string;
  period: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  periodStart: string;
  periodEnd: string;
  currency: string;
  totalAmount: number;
  totalSpent?: number;
  totalRemaining?: number;
  allocations: Array<{
    categoryId: string;
    categoryName: string;
    limit: number;
    spent?: number;
    remaining?: number;
    percentageUsed?: number;
    alertThreshold?: number;
  }>;
  rollover: boolean;
  isActive: boolean;
  alertsEnabled: boolean;
  defaultAlertThreshold?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export function BudgetsClient() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await api.get<{ data: Budget[] }>('/api/budgets');
      setBudgets(data?.data || []);
    } catch (error) {
      toast.error('Failed to load budgets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    try {
      await api.delete(`/api/budgets/${id}`);
      toast.success('Budget deleted successfully');
      fetchBudgets();
    } catch (error) {
      toast.error('Failed to delete budget');
      console.error(error);
    }
  };

  const handleClone = async (id: string) => {
    try {
      await api.post(`/api/budgets/${id}/clone`, {
        name: 'Copy of Budget',
        periodStart: new Date().toISOString(),
        periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      toast.success('Budget cloned successfully');
      fetchBudgets();
    } catch (error) {
      toast.error('Failed to clone budget');
      console.error(error);
    }
  };

  const handleRollover = async (id: string) => {
    try {
      await api.post(`/api/budgets/${id}/rollover`);
      toast.success('Budget rolled over successfully');
      fetchBudgets();
    } catch (error) {
      toast.error('Failed to rollover budget');
      console.error(error);
    }
  };

  const toggleAlerts = async (budget: Budget) => {
    try {
      await api.patch(`/api/budgets/${budget._id}`, { alertsEnabled: !budget.alertsEnabled });
      toast.success(`Alerts ${!budget.alertsEnabled ? 'enabled' : 'disabled'}`);
      fetchBudgets();
    } catch (error) {
      toast.error('Failed to update alerts');
      console.error(error);
    }
  };

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = periodFilter === 'all' || budget.period === periodFilter;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && budget.isActive) ||
                      (activeTab === 'inactive' && !budget.isActive);
    
    return matchesSearch && matchesPeriod && matchesTab;
  });

  const totalBudgeted = filteredBudgets.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalSpent = filteredBudgets.reduce((sum, b) => sum + (b.totalSpent || 0), 0);
  const totalRemaining = filteredBudgets.reduce((sum, b) => sum + (b.totalRemaining || 0), 0);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPeriodBadgeColor = (period: string) => {
    switch (period) {
      case 'monthly': return 'bg-blue-100 text-blue-800';
      case 'quarterly': return 'bg-purple-100 text-purple-800';
      case 'yearly': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4" />
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-muted-foreground">Manage your spending limits and track expenses</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudgeted.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across {filteredBudgets.length} budgets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <Progress 
              value={totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Remaining</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRemaining.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {totalBudgeted > 0 ? ((totalRemaining / totalBudgeted) * 100).toFixed(1) : 0}% available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search budgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <select
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Periods</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {filteredBudgets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No budgets found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm || periodFilter !== 'all' 
                    ? 'Try adjusting your filters'
                    : 'Create your first budget to start tracking expenses'}
                </p>
                {!searchTerm && periodFilter === 'all' && (
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Budget
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredBudgets.map((budget) => {
              const spentPercentage = budget.totalAmount > 0 
                ? ((budget.totalSpent || 0) / budget.totalAmount) * 100 
                : 0;
              const isOverBudget = spentPercentage > 100;
              const isNearLimit = spentPercentage >= (budget.defaultAlertThreshold || 80);

              return (
                <Card key={budget._id} className={isOverBudget ? 'border-red-500' : ''}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {budget.name}
                          <Badge className={getPeriodBadgeColor(budget.period)}>
                            {budget.period}
                          </Badge>
                          {budget.rollover && (
                            <Badge variant="outline">
                              <RotateCw className="h-3 w-3 mr-1" />
                              Rollover
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {budget.description || `${format(new Date(budget.periodStart), 'MMM d')} - ${format(new Date(budget.periodEnd), 'MMM d, yyyy')}`}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleAlerts(budget)}
                          title={budget.alertsEnabled ? 'Disable alerts' : 'Enable alerts'}
                        >
                          {budget.alertsEnabled ? (
                            <Bell className="h-4 w-4" />
                          ) : (
                            <BellOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingBudget(budget)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleClone(budget._id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {budget.rollover && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRollover(budget._id)}
                            title="Rollover to next period"
                          >
                            <RotateCw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(budget._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Budget Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Budget</span>
                        <span className="font-medium">
                          ${budget.totalSpent?.toFixed(2) || '0.00'} / ${budget.totalAmount.toFixed(2)}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(spentPercentage, 100)} 
                        className={`h-2 ${isOverBudget ? '[&>div]:bg-red-500' : isNearLimit ? '[&>div]:bg-yellow-500' : ''}`}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{spentPercentage.toFixed(1)}% used</span>
                        <span>${budget.totalRemaining?.toFixed(2) || '0.00'} remaining</span>
                      </div>
                    </div>

                    {/* Category Allocations */}
                    {budget.allocations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Category Allocations</h4>
                        <div className="grid gap-2">
                          {budget.allocations.map((allocation, idx) => {
                            const categoryPercentage = allocation.limit > 0 
                              ? ((allocation.spent || 0) / allocation.limit) * 100 
                              : 0;
                            const categoryNearLimit = categoryPercentage >= (allocation.alertThreshold || budget.defaultAlertThreshold || 80);
                            
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="flex items-center gap-1">
                                    {allocation.categoryName}
                                    {categoryNearLimit && (
                                      <AlertCircle className="h-3 w-3 text-yellow-500" />
                                    )}
                                  </span>
                                  <span>
                                    ${allocation.spent?.toFixed(2) || '0.00'} / ${allocation.limit.toFixed(2)}
                                  </span>
                                </div>
                                <Progress 
                                  value={Math.min(categoryPercentage, 100)} 
                                  className="h-1"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {budget.tags && budget.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {budget.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Alerts */}
                    {isOverBudget && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          This budget has been exceeded by ${((budget.totalSpent || 0) - budget.totalAmount).toFixed(2)}
                        </AlertDescription>
                      </Alert>
                    )}
                    {!isOverBudget && isNearLimit && (
                      <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800">
                          You've used {spentPercentage.toFixed(1)}% of this budget
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingBudget) && (
        <BudgetForm
          budget={editingBudget}
          onClose={() => {
            setShowCreateForm(false);
            setEditingBudget(null);
          }}
          onSuccess={() => {
            setShowCreateForm(false);
            setEditingBudget(null);
            fetchBudgets();
          }}
        />
      )}
    </div>
  );
}