import mongoose, { Document, Schema } from 'mongoose';

export interface IMilestone {
  name: string;
  targetAmount: number;
  targetDate: Date;
  completed: boolean;
  completedDate?: Date;
  notes?: string;
}

export interface ITrackingRules {
  categories?: string[];
  excludeCategories?: string[];
  sources?: string[];
  transactionTypes?: ('income' | 'expense')[];
  startDate?: Date;
  endDate?: Date;
}

export interface IProgressHistory {
  date: Date;
  amount: number;
  source: 'manual' | 'auto' | 'milestone';
  description?: string;
  transactionId?: mongoose.Types.ObjectId;
}

export interface IGoalV2 extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  type: 'savings' | 'investment' | 'debt_payoff' | 'revenue' | 'expense_reduction' | 'emergency_fund' | 'custom';
  targetAmount: number;
  currentAmount: number;
  initialAmount: number; // Starting point for the goal
  currency: string;
  deadline: Date;
  startDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'active' | 'completed' | 'paused' | 'failed' | 'cancelled';
  category?: string; // Primary category association
  milestones: IMilestone[];
  autoTrack: boolean;
  trackingRules?: ITrackingRules;
  progressHistory: IProgressHistory[];
  reminderEnabled: boolean;
  reminderFrequency?: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  lastReminderSent?: Date;
  nextMilestone?: IMilestone;
  notes?: string;
  attachments?: Array<{
    url: string;
    pathname: string;
    size: number;
    contentType: string;
    uploadedAt: Date;
  }>;
  tags?: string[];
  completedDate?: Date;
  failedDate?: Date;
  pausedDate?: Date;
  lastCalculatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Instance methods
  updateProgress(amount: number, source?: 'manual' | 'auto' | 'milestone', description?: string, transactionId?: string): Promise<IGoalV2>;
  needsAttention(): boolean;
}

const milestoneSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Milestone name cannot exceed 100 characters'],
  },
  targetAmount: {
    type: Number,
    required: true,
    min: [0, 'Target amount must be positive'],
  },
  targetDate: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedDate: Date,
  notes: {
    type: String,
    maxlength: [500, 'Milestone notes cannot exceed 500 characters'],
  },
}, { _id: false });

const trackingRulesSchema = new Schema({
  categories: [String],
  excludeCategories: [String],
  sources: [String],
  transactionTypes: [{
    type: String,
    enum: ['income', 'expense'],
  }],
  startDate: Date,
  endDate: Date,
}, { _id: false });

const progressHistorySchema = new Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    enum: ['manual', 'auto', 'milestone'],
    required: true,
  },
  description: String,
  transactionId: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction',
  },
}, { _id: false });

const goalV2Schema = new Schema<IGoalV2>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Goal name is required'],
    trim: true,
    maxlength: [200, 'Goal name cannot exceed 200 characters'],
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  type: {
    type: String,
    enum: ['savings', 'investment', 'debt_payoff', 'revenue', 'expense_reduction', 'emergency_fund', 'custom'],
    required: [true, 'Goal type is required'],
    index: true,
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0.01, 'Target amount must be positive'],
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative'],
  },
  initialAmount: {
    type: Number,
    default: 0,
    min: [0, 'Initial amount cannot be negative'],
  },
  currency: {
    type: String,
    default: 'USD',
    maxlength: 3,
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
    index: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: Date.now,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    index: true,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'paused', 'failed', 'cancelled'],
    default: 'draft',
    index: true,
  },
  category: {
    type: String,
    trim: true,
  },
  milestones: {
    type: [milestoneSchema],
    default: [],
  },
  autoTrack: {
    type: Boolean,
    default: false,
  },
  trackingRules: trackingRulesSchema,
  progressHistory: {
    type: [progressHistorySchema],
    default: [],
  },
  reminderEnabled: {
    type: Boolean,
    default: true,
  },
  reminderFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'bi-weekly', 'monthly'],
    default: 'weekly',
  },
  lastReminderSent: Date,
  notes: {
    type: String,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'],
  },
  attachments: [{
    url: String,
    pathname: String,
    size: Number,
    contentType: String,
    uploadedAt: Date,
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  completedDate: Date,
  failedDate: Date,
  pausedDate: Date,
  lastCalculatedAt: Date,
}, {
  timestamps: true,
});

// Indexes for better query performance
goalV2Schema.index({ userId: 1, status: 1, priority: 1 });
goalV2Schema.index({ userId: 1, deadline: 1 });
goalV2Schema.index({ userId: 1, type: 1, status: 1 });
goalV2Schema.index({ userId: 1, 'trackingRules.categories': 1 });

// Virtual for progress percentage
goalV2Schema.virtual('progressPercentage').get(function() {
  if (!this.targetAmount || this.targetAmount <= 0) return 0;
  const effectiveTarget = this.targetAmount - this.initialAmount;
  const effectiveProgress = this.currentAmount - this.initialAmount;
  if (effectiveTarget <= 0) return 100;
  const progress = (effectiveProgress / effectiveTarget) * 100;
  return Math.min(100, Math.max(0, Math.round(progress * 100) / 100));
});

// Virtual for days remaining
goalV2Schema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const deadline = new Date(this.deadline);
  const diff = deadline.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Virtual for is overdue
goalV2Schema.virtual('isOverdue').get(function() {
  return this.status === 'active' && new Date() > new Date(this.deadline);
});

// Virtual for next milestone
goalV2Schema.virtual('nextMilestone').get(function() {
  if (!this.milestones || this.milestones.length === 0) return null;
  
  const incompleteMilestones = this.milestones
    .filter((m: IMilestone) => !m.completed)
    .sort((a: IMilestone, b: IMilestone) => a.targetDate.getTime() - b.targetDate.getTime());
  
  return incompleteMilestones[0] || null;
});

// Virtual for required monthly savings
goalV2Schema.virtual('requiredMonthlySavings').get(function() {
  if (this.status !== 'active') return 0;
  
  const now = new Date();
  const deadline = new Date(this.deadline);
  const monthsRemaining = Math.max(1, (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth()));
  const amountRemaining = Math.max(0, this.targetAmount - this.currentAmount);
  
  return Math.round((amountRemaining / monthsRemaining) * 100) / 100;
});

// Virtual for is on track
goalV2Schema.virtual('isOnTrack').get(function() {
  if (this.status !== 'active') return true;
  
  const now = new Date();
  const start = new Date(this.startDate);
  const deadline = new Date(this.deadline);
  
  const totalDuration = deadline.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  const expectedProgress = (elapsed / totalDuration) * 100;
  
  // Calculate progress percentage inline instead of using virtual
  let progressPercentage = 0;
  if (this.targetAmount && this.targetAmount > 0) {
    const effectiveTarget = this.targetAmount - this.initialAmount;
    const effectiveProgress = this.currentAmount - this.initialAmount;
    if (effectiveTarget > 0) {
      const progress = (effectiveProgress / effectiveTarget) * 100;
      progressPercentage = Math.min(100, Math.max(0, Math.round(progress * 100) / 100));
    } else {
      progressPercentage = 100;
    }
  }
  
  return progressPercentage >= (expectedProgress * 0.9); // 90% of expected progress
});

// Method to update progress
goalV2Schema.methods.updateProgress = function(amount: number, source: 'manual' | 'auto' | 'milestone' = 'manual', description?: string, transactionId?: string) {
  const previousAmount = this.currentAmount;
  this.currentAmount = Math.max(0, this.currentAmount + amount);
  
  // Add to progress history
  this.progressHistory.push({
    date: new Date(),
    amount,
    source,
    description,
    transactionId,
  });
  
  // Update status based on progress
  if (this.currentAmount >= this.targetAmount && this.status === 'active') {
    this.status = 'completed';
    this.completedDate = new Date();
  } else if (this.currentAmount > this.initialAmount && this.status === 'draft') {
    this.status = 'active';
  }
  
  // Check and update milestones
  if (this.milestones && this.milestones.length > 0) {
    this.milestones.forEach((milestone: IMilestone) => {
      if (!milestone.completed && this.currentAmount >= milestone.targetAmount) {
        milestone.completed = true;
        milestone.completedDate = new Date();
      }
    });
  }
  
  return this.save();
};

// Method to check if goal needs attention
goalV2Schema.methods.needsAttention = function() {
  if (this.status !== 'active') return false;
  
  // Goal needs attention if:
  // 1. It's overdue
  const isOverdue = this.status === 'active' && new Date() > new Date(this.deadline);
  if (isOverdue) return true;
  
  // 2. High/critical priority with less than 50% progress and less than 30 days remaining
  if (['high', 'critical'].includes(this.priority)) {
    // Calculate progress percentage
    let progressPercentage = 0;
    if (this.targetAmount && this.targetAmount > 0) {
      const effectiveTarget = this.targetAmount - this.initialAmount;
      const effectiveProgress = this.currentAmount - this.initialAmount;
      if (effectiveTarget > 0) {
        const progress = (effectiveProgress / effectiveTarget) * 100;
        progressPercentage = Math.min(100, Math.max(0, Math.round(progress * 100) / 100));
      } else {
        progressPercentage = 100;
      }
    }
    
    // Calculate days remaining
    const now = new Date();
    const deadline = new Date(this.deadline);
    const diff = deadline.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (progressPercentage < 50 && daysRemaining < 30) return true;
  }
  
  // 3. Not on track
  const now = new Date();
  const start = new Date(this.startDate);
  const deadline = new Date(this.deadline);
  const totalDuration = deadline.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  const expectedProgress = (elapsed / totalDuration) * 100;
  
  // Calculate progress percentage for on-track check
  let currentProgressPercentage = 0;
  if (this.targetAmount && this.targetAmount > 0) {
    const effectiveTarget = this.targetAmount - this.initialAmount;
    const effectiveProgress = this.currentAmount - this.initialAmount;
    if (effectiveTarget > 0) {
      const progress = (effectiveProgress / effectiveTarget) * 100;
      currentProgressPercentage = Math.min(100, Math.max(0, Math.round(progress * 100) / 100));
    } else {
      currentProgressPercentage = 100;
    }
  }
  
  const isOnTrack = currentProgressPercentage >= (expectedProgress * 0.9);
  if (!isOnTrack) return true;
  
  // 4. Milestone overdue
  // Find next milestone
  let nextMilestone = null;
  if (this.milestones && this.milestones.length > 0) {
    const incompleteMilestones = this.milestones
      .filter((m: IMilestone) => !m.completed)
      .sort((a: IMilestone, b: IMilestone) => a.targetDate.getTime() - b.targetDate.getTime());
    nextMilestone = incompleteMilestones[0] || null;
  }
  
  if (nextMilestone && new Date() > new Date(nextMilestone.targetDate)) return true;
  
  return false;
};

// Static method to calculate progress from transactions
goalV2Schema.statics.calculateAutoProgress = async function(goalId: string) {
  const goal = await this.findById(goalId);
  if (!goal || !goal.autoTrack || !goal.trackingRules) return null;
  
  const Income = mongoose.model('Income');
  const Expense = mongoose.model('Expense');
  
  const query: any = {
    userId: goal.userId,
    status: { $in: ['completed'] },
  };
  
  // Date range
  if (goal.trackingRules.startDate) {
    query.date = { $gte: goal.trackingRules.startDate };
  }
  if (goal.trackingRules.endDate) {
    query.date = { ...query.date, $lte: goal.trackingRules.endDate };
  }
  
  // Categories filter
  if (goal.trackingRules.categories && goal.trackingRules.categories.length > 0) {
    query.category = { $in: goal.trackingRules.categories };
  }
  if (goal.trackingRules.excludeCategories && goal.trackingRules.excludeCategories.length > 0) {
    query.category = { ...query.category, $nin: goal.trackingRules.excludeCategories };
  }
  
  let totalAmount = 0;
  
  // Calculate based on transaction types
  if (!goal.trackingRules.transactionTypes || goal.trackingRules.transactionTypes.includes('income')) {
    const incomeQuery = { ...query };
    if (goal.trackingRules.sources && goal.trackingRules.sources.length > 0) {
      incomeQuery.source = { $in: goal.trackingRules.sources };
    }
    
    const incomeTotal = await Income.aggregate([
      { $match: incomeQuery },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    
    if (incomeTotal[0]) {
      totalAmount += incomeTotal[0].total;
    }
  }
  
  if (!goal.trackingRules.transactionTypes || goal.trackingRules.transactionTypes.includes('expense')) {
    const expenseTotal = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    
    if (expenseTotal[0]) {
      // For expense reduction goals, track the reduction
      if (goal.type === 'expense_reduction') {
        // This would need a baseline to compare against
        totalAmount -= expenseTotal[0].total;
      } else if (goal.type === 'debt_payoff') {
        totalAmount += expenseTotal[0].total;
      }
    }
  }
  
  // Update the goal with calculated amount
  goal.currentAmount = goal.initialAmount + totalAmount;
  goal.lastCalculatedAt = new Date();
  
  // Update status if needed
  if (goal.currentAmount >= goal.targetAmount && goal.status === 'active') {
    goal.status = 'completed';
    goal.completedDate = new Date();
  }
  
  await goal.save();
  return goal;
};

// Static method to get goals needing reminders
goalV2Schema.statics.getGoalsNeedingReminders = async function(userId?: string) {
  const now = new Date();
  const query: any = {
    status: 'active',
    reminderEnabled: true,
  };
  
  if (userId) {
    query.userId = userId;
  }
  
  const goals = await this.find(query);
  
  return goals.filter((goal: IGoalV2) => {
    if (!goal.lastReminderSent) return true;
    
    const daysSinceLastReminder = Math.floor((now.getTime() - goal.lastReminderSent.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (goal.reminderFrequency) {
      case 'daily':
        return daysSinceLastReminder >= 1;
      case 'weekly':
        return daysSinceLastReminder >= 7;
      case 'bi-weekly':
        return daysSinceLastReminder >= 14;
      case 'monthly':
        return daysSinceLastReminder >= 30;
      default:
        return false;
    }
  });
};

// Static method to get goal statistics
goalV2Schema.statics.getStatistics = async function(userId: string) {
  const goals = await this.find({ userId });
  
  const stats = {
    total: goals.length,
    byStatus: {
      draft: 0,
      active: 0,
      completed: 0,
      paused: 0,
      failed: 0,
      cancelled: 0,
    },
    byType: {} as Record<string, number>,
    byPriority: {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    },
    totalTargetAmount: 0,
    totalCurrentAmount: 0,
    overallProgress: 0,
    onTrack: 0,
    needingAttention: 0,
    upcomingMilestones: [] as IMilestone[],
  };
  
  goals.forEach((goal: IGoalV2) => {
    // Status counts
    stats.byStatus[goal.status]++;
    
    // Type counts
    stats.byType[goal.type] = (stats.byType[goal.type] || 0) + 1;
    
    // Priority counts
    stats.byPriority[goal.priority]++;
    
    // Amounts
    if (goal.status === 'active') {
      stats.totalTargetAmount += goal.targetAmount;
      stats.totalCurrentAmount += goal.currentAmount;
      
      if ((goal as any).isOnTrack) {
        stats.onTrack++;
      }
      
      if (goal.needsAttention()) {
        stats.needingAttention++;
      }
      
      // Collect upcoming milestones
      if (goal.milestones) {
        const upcoming = goal.milestones
          .filter((m: IMilestone) => !m.completed && new Date(m.targetDate) > new Date())
          .sort((a: IMilestone, b: IMilestone) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
        
        stats.upcomingMilestones.push(...upcoming.slice(0, 3));
      }
    }
  });
  
  // Calculate overall progress
  if (stats.totalTargetAmount > 0) {
    stats.overallProgress = Math.round((stats.totalCurrentAmount / stats.totalTargetAmount) * 100 * 100) / 100;
  }
  
  // Sort upcoming milestones across all goals
  stats.upcomingMilestones.sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
  stats.upcomingMilestones = stats.upcomingMilestones.slice(0, 5);
  
  return stats;
};

const GoalV2 = mongoose.models.GoalV2 || mongoose.model<IGoalV2>('GoalV2', goalV2Schema);

export default GoalV2;