import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: 'revenue' | 'expense' | 'profit' | 'savings' | 'investment' | 'debt_payoff' | 'custom';
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not_started' | 'in_progress' | 'completed' | 'paused' | 'failed';
  category?: string; // optional category association
  description?: string;
  milestones?: {
    name: string;
    targetAmount: number;
    targetDate: Date;
    completed: boolean;
    completedDate?: Date;
  }[];
  autoTrack: boolean; // automatically track progress from transactions
  trackingRules?: {
    categories?: string[]; // categories to include
    excludeCategories?: string[]; // categories to exclude
    sources?: string[]; // income sources to track
  };
  reminderEnabled: boolean;
  reminderFrequency?: 'daily' | 'weekly' | 'monthly';
  notes?: string;
  attachments?: string[];
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>({
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
  type: {
    type: String,
    enum: ['revenue', 'expense', 'profit', 'savings', 'investment', 'debt_payoff', 'custom'],
    required: [true, 'Goal type is required'],
    index: true,
  },
  targetAmount: {
    type: Number,
    required: [true, 'Target amount is required'],
    min: [0, 'Target amount must be positive'],
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount must be positive'],
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
    index: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    index: true,
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'paused', 'failed'],
    default: 'not_started',
    index: true,
  },
  category: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  milestones: [{
    name: {
      type: String,
      required: true,
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0,
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
  }],
  autoTrack: {
    type: Boolean,
    default: false,
  },
  trackingRules: {
    categories: [String],
    excludeCategories: [String],
    sources: [String],
  },
  reminderEnabled: {
    type: Boolean,
    default: true,
  },
  reminderFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'weekly',
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
  },
  attachments: [{
    type: String,
  }],
  completedDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
goalSchema.index({ userId: 1, status: 1, priority: 1 });
goalSchema.index({ userId: 1, deadline: 1 });

// Virtual for progress percentage
goalSchema.virtual('progressPercentage').get(function() {
  if (!this.targetAmount || this.targetAmount <= 0) return 0;
  const progress = (this.currentAmount / this.targetAmount) * 100;
  return Math.min(100, Math.round(progress * 10) / 10);
});

// Virtual for days remaining
goalSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const deadline = new Date(this.deadline);
  const diff = deadline.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Virtual for is overdue
goalSchema.virtual('isOverdue').get(function() {
  return this.status !== 'completed' && new Date() > new Date(this.deadline);
});

// Method to update progress
goalSchema.methods.updateProgress = function(amount: number) {
  this.currentAmount = Math.max(0, this.currentAmount + amount);
  
  // Update status based on progress
  if (this.currentAmount >= this.targetAmount) {
    this.status = 'completed';
    this.completedDate = new Date();
  } else if (this.currentAmount > 0 && this.status === 'not_started') {
    this.status = 'in_progress';
  }
  
  // Check and update milestones
  if (this.milestones && this.milestones.length > 0) {
    this.milestones.forEach((milestone: any) => {
      if (!milestone.completed && this.currentAmount >= milestone.targetAmount) {
        milestone.completed = true;
        milestone.completedDate = new Date();
      }
    });
  }
  
  return this.save();
};

// Method to check if goal needs attention
goalSchema.methods.needsAttention = function() {
  // Goal needs attention if:
  // 1. It's overdue
  // 2. Progress is significantly behind schedule
  // 3. High/critical priority with low progress
  
  if (this.isOverdue) return true;
  
  const daysRemaining = this.daysRemaining;
  const progressPercentage = this.progressPercentage;
  
  // Calculate expected progress based on time
  const totalDays = Math.ceil((new Date(this.deadline).getTime() - new Date(this.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = totalDays - daysRemaining;
  const expectedProgress = (daysPassed / totalDays) * 100;
  
  // If actual progress is 20% behind expected
  if (progressPercentage < expectedProgress - 20) return true;
  
  // High priority goals with less than 50% progress and less than 30 days
  if ((this.priority === 'high' || this.priority === 'critical') && 
      progressPercentage < 50 && daysRemaining < 30) {
    return true;
  }
  
  return false;
};

// Static method to calculate automatic progress
goalSchema.statics.calculateAutoProgress = async function(goalId: string, startDate?: Date, endDate?: Date) {
  const goal = await this.findById(goalId);
  if (!goal || !goal.autoTrack) return 0;
  
  const Income = mongoose.model('Income');
  const Expense = mongoose.model('Expense');
  
  let total = 0;
  const dateFilter = {} as any;
  if (startDate) dateFilter.$gte = startDate;
  if (endDate) dateFilter.$lte = endDate;
  
  if (goal.type === 'revenue' || goal.type === 'savings') {
    const query: any = { 
      userId: goal.userId, 
      status: 'completed',
    };
    
    if (Object.keys(dateFilter).length > 0) query.date = dateFilter;
    
    if (goal.trackingRules?.categories?.length) {
      query.category = { $in: goal.trackingRules.categories };
    } else if (goal.trackingRules?.excludeCategories?.length) {
      query.category = { $nin: goal.trackingRules.excludeCategories };
    }
    
    if (goal.trackingRules?.sources?.length) {
      query.source = { $in: goal.trackingRules.sources };
    }
    
    const result = await Income.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    
    total = result[0]?.total || 0;
  } else if (goal.type === 'expense') {
    const query: any = { 
      userId: goal.userId, 
      status: { $ne: 'cancelled' },
    };
    
    if (Object.keys(dateFilter).length > 0) query.date = dateFilter;
    
    if (goal.trackingRules?.categories?.length) {
      query.category = { $in: goal.trackingRules.categories };
    } else if (goal.trackingRules?.excludeCategories?.length) {
      query.category = { $nin: goal.trackingRules.excludeCategories };
    }
    
    const result = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    
    total = result[0]?.total || 0;
  }
  
  return total;
};

// Static method to get goals needing reminders
goalSchema.statics.getGoalsNeedingReminders = async function(userId?: string) {
  const query: any = { 
    status: 'in_progress',
    reminderEnabled: true,
    deadline: { $gt: new Date() },
  };
  
  if (userId) query.userId = userId;
  
  const goals = await this.find(query);
  return goals.filter((goal: any) => goal.needsAttention && goal.needsAttention());
};

const Goal = mongoose.models.Goal || mongoose.model<IGoal>('Goal', goalSchema);

export default Goal;
