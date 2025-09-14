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
  Target,
  TrendingUp,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Pause,
  Play,
  Trophy,
  Milestone,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PiggyBank,
  Home,
  Car,
  GraduationCap,
  Plane,
  Heart,
  Briefcase,
  Gift,
  Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GoalForm } from '@/components/dashboard/goal-form';
import { ProgressUpdateDialog } from '@/components/dashboard/goal-progress-dialog';
import { MilestoneDialog } from '@/components/dashboard/goal-milestone-dialog';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';
import { format, differenceInDays } from 'date-fns';

interface Milestone {
  name: string;
  description?: string;
  targetAmount: number;
  deadline: string;
  completed: boolean;
  completedDate?: string;
}

interface Goal {
  _id: string;
  name: string;
  description?: string;
  type: 'savings' | 'debt' | 'investment' | 'purchase' | 'other';
  targetAmount: number;
  currentAmount: number;
  initialAmount: number;
  deadline: string;
  startDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'failed';
  category?: string;
  currency: string;
  autoTrack: boolean;
  trackingRules?: any;
  reminderEnabled: boolean;
  reminderFrequency?: 'daily' | 'weekly' | 'monthly';
  milestones: Milestone[];
  progressHistory: Array<{
    date: string;
    amount: number;
    description?: string;
    source: string;
  }>;
  tags?: string[];
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

const goalIcons: Record<string, any> = {
  savings: PiggyBank,
  debt: TrendingUp,
  investment: BarChart3,
  purchase: Gift,
  home: Home,
  car: Car,
  education: GraduationCap,
  travel: Plane,
  health: Heart,
  business: Briefcase,
  other: Target,
};

export function GoalsClient() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [updatingProgress, setUpdatingProgress] = useState<Goal | null>(null);
  const [managingMilestones, setManagingMilestones] = useState<Goal | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await api.get<{ goals: Goal[] }>('/api/goals');
      setGoals(data?.goals || []);
    } catch (error) {
      toast.error('Failed to load goals');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      await api.delete(`/api/goals/${id}`);
      toast.success('Goal deleted successfully');
      fetchGoals();
    } catch (error) {
      toast.error('Failed to delete goal');
      console.error(error);
    }
  };

  const handleStatusChange = async (goal: Goal, newStatus: string) => {
    try {
      await api.patch(`/api/goals/${goal._id}`, { status: newStatus });
      toast.success(`Goal ${newStatus}`);
      fetchGoals();
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const getGoalIcon = (goal: Goal) => {
    const Icon = goalIcons[goal.type] || goalIcons[goal.category || ''] || Target;
    return Icon;
  };

  const getProgressPercentage = (goal: Goal) => {
    if (goal.targetAmount === 0) return 0;
    const progress = ((goal.currentAmount - goal.initialAmount) / (goal.targetAmount - goal.initialAmount)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getDaysRemaining = (deadline: string) => {
    const days = differenceInDays(new Date(deadline), new Date());
    return days;
  };

  const getMonthlyRequired = (goal: Goal) => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const daysLeft = getDaysRemaining(goal.deadline);
    const monthsLeft = Math.max(daysLeft / 30, 1);
    return remaining / monthsLeft;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || goal.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || goal.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const activeGoals = filteredGoals.filter(g => g.status === 'active');
  const completedGoals = filteredGoals.filter(g => g.status === 'completed');
  const totalTargetAmount = activeGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = activeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4" />
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
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
          <h1 className="text-3xl font-bold">Financial Goals</h1>
          <p className="text-muted-foreground">Track your progress towards financial milestones</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Goal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedGoals.length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Target</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalTargetAmount.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Across all active goals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCurrentAmount.toFixed(0)}</div>
            <Progress value={totalProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goals.length > 0 
                ? ((completedGoals.length / goals.length) * 100).toFixed(0)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Of all goals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search goals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Types</option>
          <option value="savings">Savings</option>
          <option value="debt">Debt</option>
          <option value="investment">Investment</option>
          <option value="purchase">Purchase</option>
          <option value="other">Other</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGoals.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No goals found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first goal to start tracking progress'}
              </p>
              {!searchTerm && typeFilter === 'all' && statusFilter === 'all' && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Goal
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredGoals.map((goal) => {
            const Icon = getGoalIcon(goal);
            const progress = getProgressPercentage(goal);
            const daysLeft = getDaysRemaining(goal.deadline);
            const monthlyRequired = getMonthlyRequired(goal);
            const isOverdue = daysLeft < 0 && goal.status === 'active';
            const nextMilestone = goal.milestones.find(m => !m.completed);

            return (
              <Card key={goal._id} className={isOverdue ? 'border-red-500' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getStatusColor(goal.status).replace('text-', 'bg-').replace('-600', '-100')}`}>
                        <Icon className={`h-5 w-5 ${getStatusColor(goal.status).replace('bg-', 'text-').replace('-100', '-600')}`} />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {goal.description || `${goal.type} goal`}
                        </CardDescription>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(goal.priority)} variant="secondary">
                            {goal.priority}
                          </Badge>
                          <Badge className={getStatusColor(goal.status)} variant="secondary">
                            {goal.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {goal.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setUpdatingProgress(goal)}
                          title="Update progress"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setManagingMilestones(goal)}
                        title="Manage milestones"
                      >
                        <Milestone className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingGoal(goal)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(goal._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">
                        ${goal.currentAmount.toFixed(0)} / ${goal.targetAmount.toFixed(0)}
                      </span>
                    </div>
                    <Progress 
                      value={progress} 
                      className={`h-2 ${progress >= 100 ? '[&>div]:bg-green-500' : ''}`}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{progress.toFixed(1)}% complete</span>
                      <span>${(goal.targetAmount - goal.currentAmount).toFixed(0)} remaining</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs">
                        {format(new Date(goal.startDate), 'MMM yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                        {isOverdue 
                          ? `${Math.abs(daysLeft)} days overdue`
                          : `${daysLeft} days left`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span className="text-xs">
                        {format(new Date(goal.deadline), 'MMM yyyy')}
                      </span>
                    </div>
                  </div>

                  {/* Monthly Required */}
                  {goal.status === 'active' && monthlyRequired > 0 && (
                    <Alert className="py-2">
                      <Zap className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Save ${monthlyRequired.toFixed(0)}/month to reach your goal
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Next Milestone */}
                  {nextMilestone && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Milestone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium">Next: {nextMilestone.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ${nextMilestone.targetAmount.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Milestones Progress */}
                  {goal.milestones.length > 0 && (
                    <div className="flex gap-1">
                      {goal.milestones.map((milestone, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 h-1 rounded-full ${
                            milestone.completed 
                              ? 'bg-green-500' 
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                          title={milestone.name}
                        />
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {goal.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleStatusChange(goal, 'paused')}
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                    )}
                    {goal.status === 'paused' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleStatusChange(goal, 'active')}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Resume
                      </Button>
                    )}
                    {goal.status === 'active' && progress >= 100 && (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStatusChange(goal, 'completed')}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    )}
                  </div>

                  {/* Tags */}
                  {goal.tags && goal.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {goal.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Dialogs */}
      {(showCreateForm || editingGoal) && (
        <GoalForm
          goal={editingGoal}
          onClose={() => {
            setShowCreateForm(false);
            setEditingGoal(null);
          }}
          onSuccess={() => {
            setShowCreateForm(false);
            setEditingGoal(null);
            fetchGoals();
          }}
        />
      )}

      {updatingProgress && (
        <ProgressUpdateDialog
          goal={updatingProgress}
          onClose={() => setUpdatingProgress(null)}
          onSuccess={() => {
            setUpdatingProgress(null);
            fetchGoals();
          }}
        />
      )}

      {managingMilestones && (
        <MilestoneDialog
          goal={managingMilestones}
          onClose={() => setManagingMilestones(null)}
          onSuccess={() => {
            setManagingMilestones(null);
            fetchGoals();
          }}
        />
      )}
    </div>
  );
}