import mongoose, { Document, Schema } from 'mongoose';

export interface ICategoryAllocation {
  categoryId: string;
  categoryName: string;
  limit: number;
  alertThreshold?: number; // percentage at which to alert (e.g., 80%)
  spent?: number; // calculated at runtime
  remaining?: number; // calculated at runtime
  percentageUsed?: number; // calculated at runtime
}

export interface IBudgetV2 extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  period: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  periodStart: Date;
  periodEnd: Date;
  currency: string;
  totalAmount: number; // total budget amount
  allocations: ICategoryAllocation[];
  rollover: boolean; // whether remaining budget rolls over to next period
  isActive: boolean;
  alertsEnabled: boolean;
  defaultAlertThreshold?: number;
  lastCalculatedAt?: Date;
  totalSpent?: number; // cached total spent
  totalRemaining?: number; // cached total remaining
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  // Instance methods
  isOverThreshold(): boolean;
  getCategoriesOverThreshold(): ICategoryAllocation[];
}

export interface IBudgetV2Model extends mongoose.Model<IBudgetV2> {
  calculateUsage(budgetId: string): Promise<IBudgetV2 | null>;
  getActiveBudgets(userId: string): Promise<IBudgetV2[]>;
  checkAlerts(userId: string): Promise<any[]>;
}

const categoryAllocationSchema = new Schema({
  categoryId: {
    type: String,
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
    min: [0, 'Limit must be positive'],
  },
  alertThreshold: {
    type: Number,
    min: [1, 'Threshold must be between 1 and 100'],
    max: [100, 'Threshold must be between 1 and 100'],
  },
  spent: {
    type: Number,
    default: 0,
  },
  remaining: {
    type: Number,
  },
  percentageUsed: {
    type: Number,
  },
}, { _id: false });

const budgetV2Schema = new Schema<IBudgetV2>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Budget name is required'],
    trim: true,
    maxlength: [200, 'Budget name cannot exceed 200 characters'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  period: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly', 'custom'],
    default: 'monthly',
    index: true,
  },
  periodStart: {
    type: Date,
    required: [true, 'Period start date is required'],
    index: true,
  },
  periodEnd: {
    type: Date,
    required: [true, 'Period end date is required'],
    index: true,
  },
  currency: {
    type: String,
    default: 'USD',
    maxlength: 3,
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total budget amount is required'],
    min: [0, 'Amount must be positive'],
  },
  allocations: {
    type: [categoryAllocationSchema],
    required: true,
    validate: {
      validator: function(allocations: ICategoryAllocation[]) {
        return allocations && allocations.length > 0;
      },
      message: 'At least one category allocation is required',
    },
  },
  rollover: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  alertsEnabled: {
    type: Boolean,
    default: true,
  },
  defaultAlertThreshold: {
    type: Number,
    min: [1, 'Threshold must be between 1 and 100'],
    max: [100, 'Threshold must be between 1 and 100'],
    default: 80,
  },
  lastCalculatedAt: {
    type: Date,
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: [0, 'Total spent must be positive'],
  },
  totalRemaining: {
    type: Number,
  },
  tags: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

// Indexes for better query performance
budgetV2Schema.index({ userId: 1, isActive: 1 });
budgetV2Schema.index({ userId: 1, periodStart: 1, periodEnd: 1 });
budgetV2Schema.index({ userId: 1, 'allocations.categoryId': 1 });

// Virtual for checking if budget period is current
budgetV2Schema.virtual('isCurrent').get(function() {
  const now = new Date();
  return now >= this.periodStart && now <= this.periodEnd;
});

// Virtual for days remaining in budget period
budgetV2Schema.virtual('daysRemaining').get(function() {
  const now = new Date();
  if (now > this.periodEnd) return 0;
  const diffTime = Math.abs(this.periodEnd.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to check if budget exceeded threshold
budgetV2Schema.methods.isOverThreshold = function() {
  if (!this.alertsEnabled) return false;
  if (!this.totalAmount || this.totalAmount <= 0) return false;
  const usage = (this.totalSpent / this.totalAmount) * 100;
  return usage >= (this.defaultAlertThreshold || 80);
};

// Method to check if any category is over threshold
budgetV2Schema.methods.getCategoriesOverThreshold = function() {
  if (!this.alertsEnabled) return [];
  
  return this.allocations.filter((allocation: ICategoryAllocation) => {
    if (!allocation.limit || allocation.limit <= 0) return false;
    const threshold = allocation.alertThreshold || this.defaultAlertThreshold || 80;
    const usage = ((allocation.spent || 0) / allocation.limit) * 100;
    return usage >= threshold;
  });
};

// Static method to calculate spent amounts for all categories
budgetV2Schema.statics.calculateUsage = async function(budgetId: string) {
  const budget = await this.findById(budgetId);
  if (!budget) return null;
  
  const Expense = mongoose.model('Expense');
  
  // Get spending for each category
  const categorySpending = await Expense.aggregate([
    {
      $match: {
        userId: budget.userId,
        category: { $in: budget.allocations.map((a: ICategoryAllocation) => a.categoryName) },
        date: { $gte: budget.periodStart, $lte: budget.periodEnd },
        status: { $ne: 'cancelled' },
      }
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
      }
    },
  ]);
  
  // Create a map of spending by category
  const spendingMap = new Map();
  categorySpending.forEach((item: any) => {
    spendingMap.set(item._id, item.total);
  });
  
  // Update allocations with spent amounts
  let totalSpent = 0;
  const updatedAllocations = budget.allocations.map((allocation: ICategoryAllocation) => {
    const spent = spendingMap.get(allocation.categoryName) || 0;
    const remaining = Math.max(0, allocation.limit - spent);
    const percentageUsed = allocation.limit > 0 ? (spent / allocation.limit) * 100 : 0;
    
    totalSpent += spent;
    
    return {
      ...allocation,
      spent,
      remaining,
      percentageUsed: Math.round(percentageUsed * 100) / 100, // Round to 2 decimal places
    };
  });
  
  const totalRemaining = Math.max(0, budget.totalAmount - totalSpent);
  
  // Update the budget with calculated values
  budget.allocations = updatedAllocations;
  budget.totalSpent = totalSpent;
  budget.totalRemaining = totalRemaining;
  budget.lastCalculatedAt = new Date();
  
  await budget.save();
  
  return budget;
};

// Static method to get all active budgets for a user
budgetV2Schema.statics.getActiveBudgets = async function(userId: string) {
  const now = new Date();
  return this.find({
    userId,
    isActive: true,
    periodStart: { $lte: now },
    periodEnd: { $gte: now },
  });
};

// Static method to check for budget alerts
budgetV2Schema.statics.checkAlerts = async function(userId: string) {
  const activeBudgets = await (this as any).getActiveBudgets(userId);
  const alerts = [];
  
  for (const budget of activeBudgets) {
    // Calculate latest usage
    await (this as any).calculateUsage(budget._id);
    
    // Check overall budget threshold
    if (budget.isOverThreshold()) {
      alerts.push({
        budgetId: budget._id,
        budgetName: budget.name,
        type: 'overall',
        message: `Budget "${budget.name}" has reached ${Math.round((budget.totalSpent / budget.totalAmount) * 100)}% of total allocation`,
        spent: budget.totalSpent,
        limit: budget.totalAmount,
      });
    }
    
    // Check category thresholds
    const categoriesOverThreshold = budget.getCategoriesOverThreshold();
    for (const category of categoriesOverThreshold) {
      alerts.push({
        budgetId: budget._id,
        budgetName: budget.name,
        type: 'category',
        category: category.categoryName,
        message: `Category "${category.categoryName}" in budget "${budget.name}" has reached ${Math.round(category.percentageUsed)}% of allocation`,
        spent: category.spent,
        limit: category.limit,
      });
    }
  }
  
  return alerts;
};

const BudgetV2 = (mongoose.models.BudgetV2 || mongoose.model<IBudgetV2, IBudgetV2Model>('BudgetV2', budgetV2Schema)) as IBudgetV2Model;

export default BudgetV2;