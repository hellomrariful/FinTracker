import GoalV2, { IGoalV2, IMilestone, ITrackingRules } from '../models/GoalV2';
import mongoose from 'mongoose';

export interface GoalFilters {
  status?: string | string[];
  type?: string | string[];
  priority?: string | string[];
  category?: string;
  isOverdue?: boolean;
  isOnTrack?: boolean;
  needsAttention?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
  tags?: string[];
}

export interface CreateGoalData {
  name: string;
  description?: string;
  type: 'savings' | 'investment' | 'debt_payoff' | 'revenue' | 'expense_reduction' | 'emergency_fund' | 'custom';
  targetAmount: number;
  initialAmount?: number;
  currency?: string;
  deadline: Date;
  startDate?: Date;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'draft' | 'active' | 'completed' | 'paused' | 'failed' | 'cancelled';
  category?: string;
  milestones?: IMilestone[];
  autoTrack?: boolean;
  trackingRules?: ITrackingRules;
  reminderEnabled?: boolean;
  reminderFrequency?: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  notes?: string;
  tags?: string[];
}

export interface UpdateGoalData extends Partial<CreateGoalData> {
  currentAmount?: number;
  attachments?: Array<{
    url: string;
    pathname: string;
    size: number;
    contentType: string;
    uploadedAt: Date;
  }>;
}

export interface GoalProgressUpdate {
  amount: number;
  source?: 'manual' | 'auto' | 'milestone';
  description?: string;
  transactionId?: string;
}

export interface GoalStatisticsSummary {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  totalTargetAmount: number;
  totalCurrentAmount: number;
  overallProgress: number;
  onTrack: number;
  needingAttention: number;
  upcomingMilestones: IMilestone[];
  recentlyCompleted: IGoalV2[];
  expiringSoon: IGoalV2[];
}

class GoalRepository {
  async list(
    userId: string,
    filters: GoalFilters = {},
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'deadline',
    sortOrder: 'asc' | 'desc' = 'asc'
  ) {
    const query: any = { userId };

    // Status filter
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        query.status = { $in: filters.status };
      } else {
        query.status = filters.status;
      }
    }

    // Type filter
    if (filters.type) {
      if (Array.isArray(filters.type)) {
        query.type = { $in: filters.type };
      } else {
        query.type = filters.type;
      }
    }

    // Priority filter
    if (filters.priority) {
      if (Array.isArray(filters.priority)) {
        query.priority = { $in: filters.priority };
      } else {
        query.priority = filters.priority;
      }
    }

    // Category filter
    if (filters.category) {
      query.category = filters.category;
    }

    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      query.deadline = {};
      if (filters.dateFrom) {
        query.deadline.$gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        query.deadline.$lte = filters.dateTo;
      }
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    // Search term
    if (filters.searchTerm) {
      query.$or = [
        { name: { $regex: filters.searchTerm, $options: 'i' } },
        { description: { $regex: filters.searchTerm, $options: 'i' } },
        { notes: { $regex: filters.searchTerm, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get base results
    const [goals, total] = await Promise.all([
      GoalV2.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      GoalV2.countDocuments(query),
    ]);

    // Apply virtual filters if needed
    let filteredGoals = goals;
    
    if (filters.isOverdue !== undefined) {
      filteredGoals = filteredGoals.filter((goal: any) => {
        const isOverdue = goal.status === 'active' && new Date() > new Date(goal.deadline);
        return filters.isOverdue ? isOverdue : !isOverdue;
      });
    }

    if (filters.isOnTrack !== undefined) {
      filteredGoals = filteredGoals.filter((goal: any) => {
        if (goal.status !== 'active') return filters.isOnTrack;
        
        const now = new Date();
        const start = new Date(goal.startDate);
        const deadline = new Date(goal.deadline);
        
        const totalDuration = deadline.getTime() - start.getTime();
        const elapsed = now.getTime() - start.getTime();
        const expectedProgress = (elapsed / totalDuration) * 100;
        
        const progressPercentage = this.calculateProgressPercentage(goal);
        const isOnTrack = progressPercentage >= (expectedProgress * 0.9);
        
        return filters.isOnTrack ? isOnTrack : !isOnTrack;
      });
    }

    if (filters.needsAttention !== undefined) {
      filteredGoals = filteredGoals.filter((goal: any) => {
        const needsAttention = this.checkNeedsAttention(goal);
        return filters.needsAttention ? needsAttention : !needsAttention;
      });
    }

    // Add computed properties
    const goalsWithComputedProps = filteredGoals.map((goal: any) => ({
      ...goal,
      progressPercentage: this.calculateProgressPercentage(goal),
      daysRemaining: this.calculateDaysRemaining(goal.deadline),
      isOverdue: goal.status === 'active' && new Date() > new Date(goal.deadline),
      isOnTrack: this.checkIsOnTrack(goal),
      needsAttention: this.checkNeedsAttention(goal),
      requiredMonthlySavings: this.calculateRequiredMonthlySavings(goal),
      nextMilestone: this.getNextMilestone(goal),
    }));

    return {
      goals: goalsWithComputedProps,
      total: filteredGoals.length,
      page,
      pages: Math.ceil(filteredGoals.length / limit),
    };
  }

  async findById(goalId: string, userId: string) {
    const goal = await GoalV2.findOne({ _id: goalId, userId }).lean();
    
    if (!goal) {
      return null;
    }

    // Add computed properties
    return {
      ...goal,
      progressPercentage: this.calculateProgressPercentage(goal as any),
      daysRemaining: this.calculateDaysRemaining((goal as any).deadline),
      isOverdue: (goal as any).status === 'active' && new Date() > new Date((goal as any).deadline),
      isOnTrack: this.checkIsOnTrack(goal as any),
      needsAttention: this.checkNeedsAttention(goal as any),
      requiredMonthlySavings: this.calculateRequiredMonthlySavings(goal as any),
      nextMilestone: this.getNextMilestone(goal as any),
    };
  }

  async create(userId: string, data: CreateGoalData) {
    const goalData = {
      ...data,
      userId,
      startDate: data.startDate || new Date(),
      currency: data.currency || 'USD',
      priority: data.priority || 'medium',
      status: data.status || 'draft',
      autoTrack: data.autoTrack || false,
      reminderEnabled: data.reminderEnabled !== undefined ? data.reminderEnabled : true,
      reminderFrequency: data.reminderFrequency || 'weekly',
      initialAmount: data.initialAmount || 0,
      currentAmount: data.initialAmount || 0,
      milestones: data.milestones || [],
      tags: data.tags || [],
      progressHistory: [],
    };

    const goal = new GoalV2(goalData);
    await goal.save();

    // If autoTrack is enabled and has tracking rules, calculate initial progress
    if (goal.autoTrack && goal.trackingRules) {
      await (GoalV2 as any).calculateAutoProgress(goal._id.toString());
      return this.findById(goal._id.toString(), userId);
    }

    return this.findById(goal._id.toString(), userId);
  }

  async update(goalId: string, userId: string, data: UpdateGoalData) {
    const goal = await GoalV2.findOne({ _id: goalId, userId });
    
    if (!goal) {
      throw new Error('Goal not found');
    }

    // Update fields
    Object.keys(data).forEach(key => {
      if (data[key as keyof UpdateGoalData] !== undefined) {
        (goal as any)[key] = data[key as keyof UpdateGoalData];
      }
    });

    // If status is being changed, update relevant dates
    if (data.status) {
      switch (data.status) {
        case 'completed':
          goal.completedDate = new Date();
          break;
        case 'paused':
          goal.pausedDate = new Date();
          break;
        case 'failed':
          goal.failedDate = new Date();
          break;
        case 'active':
          // Clear special dates when reactivating
          goal.completedDate = undefined;
          goal.pausedDate = undefined;
          goal.failedDate = undefined;
          break;
      }
    }

    await goal.save();

    // If autoTrack settings changed, recalculate progress
    if ((data.autoTrack !== undefined || data.trackingRules !== undefined) && goal.autoTrack) {
      await (GoalV2 as any).calculateAutoProgress(goal._id.toString());
    }

    return this.findById(goal._id.toString(), userId);
  }

  async updateProgress(goalId: string, userId: string, progressData: GoalProgressUpdate) {
    const goal = await GoalV2.findOne({ _id: goalId, userId });
    
    if (!goal) {
      throw new Error('Goal not found');
    }

    await goal.updateProgress(
      progressData.amount,
      progressData.source || 'manual',
      progressData.description,
      progressData.transactionId
    );

    return this.findById(goal._id.toString(), userId);
  }

  async delete(goalId: string, userId: string) {
    const result = await GoalV2.deleteOne({ _id: goalId, userId });
    return result.deletedCount > 0;
  }

  async bulkDelete(goalIds: string[], userId: string) {
    const result = await GoalV2.deleteMany({
      _id: { $in: goalIds },
      userId,
    });
    return result.deletedCount;
  }

  async addMilestone(goalId: string, userId: string, milestone: IMilestone) {
    const goal = await GoalV2.findOne({ _id: goalId, userId });
    
    if (!goal) {
      throw new Error('Goal not found');
    }

    goal.milestones.push(milestone);
    await goal.save();

    return this.findById(goal._id.toString(), userId);
  }

  async updateMilestone(goalId: string, userId: string, milestoneIndex: number, milestoneData: Partial<IMilestone>) {
    const goal = await GoalV2.findOne({ _id: goalId, userId });
    
    if (!goal) {
      throw new Error('Goal not found');
    }

    if (milestoneIndex < 0 || milestoneIndex >= goal.milestones.length) {
      throw new Error('Invalid milestone index');
    }

    Object.assign(goal.milestones[milestoneIndex], milestoneData);
    await goal.save();

    return this.findById(goal._id.toString(), userId);
  }

  async deleteMilestone(goalId: string, userId: string, milestoneIndex: number) {
    const goal = await GoalV2.findOne({ _id: goalId, userId });
    
    if (!goal) {
      throw new Error('Goal not found');
    }

    if (milestoneIndex < 0 || milestoneIndex >= goal.milestones.length) {
      throw new Error('Invalid milestone index');
    }

    goal.milestones.splice(milestoneIndex, 1);
    await goal.save();

    return this.findById(goal._id.toString(), userId);
  }

  async recalculateAutoProgress(goalId: string, userId: string) {
    const goal = await GoalV2.findOne({ _id: goalId, userId });
    
    if (!goal) {
      throw new Error('Goal not found');
    }

    if (!goal.autoTrack || !goal.trackingRules) {
      throw new Error('Goal does not have auto-tracking enabled');
    }

    await (GoalV2 as any).calculateAutoProgress(goal._id.toString());
    return this.findById(goal._id.toString(), userId);
  }

  async getStatistics(userId: string): Promise<GoalStatisticsSummary> {
    const baseStats = await (GoalV2 as any).getStatistics(userId);

    // Get recently completed goals
    const recentlyCompleted = await GoalV2.find({
      userId,
      status: 'completed',
      completedDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
    })
      .sort({ completedDate: -1 })
      .limit(5)
      .lean();

    // Get goals expiring soon
    const expiringSoon = await GoalV2.find({
      userId,
      status: 'active',
      deadline: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
      },
    })
      .sort({ deadline: 1 })
      .limit(5)
      .lean();

    return {
      ...baseStats,
      recentlyCompleted,
      expiringSoon,
    };
  }

  async getGoalsNeedingReminders(userId?: string) {
    return (GoalV2 as any).getGoalsNeedingReminders(userId);
  }

  async markReminderSent(goalId: string) {
    await GoalV2.updateOne(
      { _id: goalId },
      { lastReminderSent: new Date() }
    );
  }

  // Helper methods
  private calculateProgressPercentage(goal: any): number {
    if (!goal.targetAmount || goal.targetAmount <= 0) return 0;
    const effectiveTarget = goal.targetAmount - goal.initialAmount;
    const effectiveProgress = goal.currentAmount - goal.initialAmount;
    if (effectiveTarget <= 0) return 100;
    const progress = (effectiveProgress / effectiveTarget) * 100;
    return Math.min(100, Math.max(0, Math.round(progress * 100) / 100));
  }

  private calculateDaysRemaining(deadline: Date): number {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  private checkIsOnTrack(goal: any): boolean {
    if (goal.status !== 'active') return true;
    
    const now = new Date();
    const start = new Date(goal.startDate);
    const deadline = new Date(goal.deadline);
    
    const totalDuration = deadline.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    const expectedProgress = (elapsed / totalDuration) * 100;
    
    const progressPercentage = this.calculateProgressPercentage(goal);
    return progressPercentage >= (expectedProgress * 0.9);
  }

  private checkNeedsAttention(goal: any): boolean {
    if (goal.status !== 'active') return false;
    
    const isOverdue = new Date() > new Date(goal.deadline);
    if (isOverdue) return true;
    
    const daysRemaining = this.calculateDaysRemaining(goal.deadline);
    const progressPercentage = this.calculateProgressPercentage(goal);
    
    if (['high', 'critical'].includes(goal.priority)) {
      if (progressPercentage < 50 && daysRemaining < 30) return true;
    }
    
    if (!this.checkIsOnTrack(goal)) return true;
    
    const nextMilestone = this.getNextMilestone(goal);
    if (nextMilestone && new Date() > new Date(nextMilestone.targetDate)) return true;
    
    return false;
  }

  private calculateRequiredMonthlySavings(goal: any): number {
    if (goal.status !== 'active') return 0;
    
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const monthsRemaining = Math.max(1, (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth()));
    const amountRemaining = Math.max(0, goal.targetAmount - goal.currentAmount);
    
    return Math.round((amountRemaining / monthsRemaining) * 100) / 100;
  }

  private getNextMilestone(goal: any): IMilestone | null {
    if (!goal.milestones || goal.milestones.length === 0) return null;
    
    const incompleteMilestones = goal.milestones
      .filter((m: IMilestone) => !m.completed)
      .sort((a: IMilestone, b: IMilestone) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
    
    return incompleteMilestones[0] || null;
  }
}

export const goalRepo = new GoalRepository();