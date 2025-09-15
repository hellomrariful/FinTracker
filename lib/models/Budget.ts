import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  name?: string;
  category: string; // category name reference
  period: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  startDate: Date;
  endDate: Date;
  amount: number; // allocated budget
  spent: number; // calculated or tracked amount
  rollover: boolean; // whether remaining budget rolls over to next period
  alertsEnabled: boolean;
  alertThreshold?: number; // percentage at which to alert (e.g., 80%)
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    index: true,
  },
  period: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly', 'custom'],
    default: 'monthly',
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0, 'Amount must be positive'],
  },
  spent: {
    type: Number,
    default: 0,
    min: [0, 'Spent must be positive'],
  },
  rollover: {
    type: Boolean,
    default: false,
  },
  alertsEnabled: {
    type: Boolean,
    default: true,
  },
  alertThreshold: {
    type: Number,
    min: [1, 'Threshold must be between 1 and 100'],
    max: [100, 'Threshold must be between 1 and 100'],
    default: 80,
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
  },
}, {
  timestamps: true,
});

// Static method to calculate spent amount for the budget period
budgetSchema.statics.calculateSpent = async function(budgetId: string) {
  const budget = await this.findById(budgetId);
  if (!budget) return 0;
  
  const Expense = mongoose.model('Expense');
  
  const result = await Expense.aggregate([
    { $match: {
      userId: budget.userId,
      category: budget.category,
      date: { $gte: budget.startDate, $lte: budget.endDate },
      status: { $ne: 'cancelled' },
    }},
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  
  return result[0]?.total || 0;
};

// Method to check if budget exceeded threshold
budgetSchema.methods.isOverThreshold = function() {
  if (!this.alertsEnabled || !this.alertThreshold) return false;
  if (!this.amount || this.amount <= 0) return false;
  const usage = (this.spent / this.amount) * 100;
  return usage >= this.alertThreshold;
};

const Budget = mongoose.models.Budget || mongoose.model<IBudget>('Budget', budgetSchema);

export default Budget;
