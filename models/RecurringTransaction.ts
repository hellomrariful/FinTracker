import mongoose, { Document, Schema } from 'mongoose';

export interface IRecurringTransaction extends Document {
  userId: string;
  name: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  nextDueDate: Date;
  lastProcessedDate?: Date;
  dayOfMonth?: number; // For monthly transactions
  dayOfWeek?: number; // For weekly transactions (0-6, Sunday-Saturday)
  isActive: boolean;
  isPaused: boolean;
  tags?: string[];
  paymentMethod?: string;
  vendor?: string;
  customer?: string;
  autoProcess: boolean; // Whether to automatically create transactions
  notifyBeforeDays: number; // Days before due date to send notification
  metadata?: Record<string, any>;
  executionHistory: Array<{
    date: Date;
    transactionId?: string;
    status: 'success' | 'failed' | 'skipped';
    error?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const RecurringTransactionSchema = new Schema<IRecurringTransaction>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['expense', 'income'],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    description: String,
    frequency: {
      type: String,
      required: true,
      enum: ['daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly'],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    nextDueDate: {
      type: Date,
      required: true,
      index: true,
    },
    lastProcessedDate: Date,
    dayOfMonth: {
      type: Number,
      min: 1,
      max: 31,
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isPaused: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    paymentMethod: String,
    vendor: String,
    customer: String,
    autoProcess: {
      type: Boolean,
      default: false,
    },
    notifyBeforeDays: {
      type: Number,
      default: 1,
      min: 0,
    },
    metadata: Schema.Types.Mixed,
    executionHistory: [{
      date: Date,
      transactionId: String,
      status: {
        type: String,
        enum: ['success', 'failed', 'skipped'],
      },
      error: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
RecurringTransactionSchema.index({ userId: 1, isActive: 1 });
RecurringTransactionSchema.index({ nextDueDate: 1, isActive: 1 });
RecurringTransactionSchema.index({ userId: 1, type: 1 });

// Calculate next due date based on frequency
RecurringTransactionSchema.methods.calculateNextDueDate = function() {
  const current = this.nextDueDate || this.startDate;
  const next = new Date(current);

  switch (this.frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'bi-weekly':
      next.setDate(next.getDate() + 14);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      if (this.dayOfMonth) {
        next.setDate(Math.min(this.dayOfMonth, new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()));
      }
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  return next;
};

// Check if transaction is due
RecurringTransactionSchema.methods.isDue = function() {
  if (!this.isActive || this.isPaused) return false;
  if (this.endDate && new Date() > this.endDate) return false;
  
  const now = new Date();
  return this.nextDueDate <= now;
};

// Process the recurring transaction
RecurringTransactionSchema.methods.process = async function() {
  if (!this.isDue()) {
    return { success: false, reason: 'Not due yet' };
  }

  try {
    // Here you would create the actual transaction
    // This is a placeholder - integrate with your transaction creation logic
    const transactionData = {
      userId: this.userId,
      name: this.name,
      type: this.type,
      amount: this.amount,
      category: this.category,
      description: this.description,
      date: new Date(),
      paymentMethod: this.paymentMethod,
      vendor: this.vendor,
      customer: this.customer,
      tags: [...(this.tags || []), 'recurring'],
      recurringTransactionId: this._id,
    };

    // Create the transaction (implement this based on your transaction model)
    // const transaction = await Transaction.create(transactionData);

    // Update execution history
    this.executionHistory.push({
      date: new Date(),
      // transactionId: transaction._id,
      status: 'success',
    });

    // Update dates
    this.lastProcessedDate = new Date();
    this.nextDueDate = this.calculateNextDueDate();

    // Check if we've reached the end date
    if (this.endDate && this.nextDueDate > this.endDate) {
      this.isActive = false;
    }

    await this.save();

    return { success: true, nextDueDate: this.nextDueDate };
  } catch (error: any) {
    // Log failure in execution history
    this.executionHistory.push({
      date: new Date(),
      status: 'failed',
      error: error.message,
    });

    await this.save();

    return { success: false, error: error.message };
  }
};

// Static method to get all due recurring transactions
RecurringTransactionSchema.statics.getDueTransactions = async function() {
  const now = new Date();
  return this.find({
    isActive: true,
    isPaused: false,
    nextDueDate: { $lte: now },
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gte: now } },
    ],
  });
};

// Static method to get upcoming transactions
RecurringTransactionSchema.statics.getUpcoming = async function(userId: string, days = 30) {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + days);

  return this.find({
    userId,
    isActive: true,
    isPaused: false,
    nextDueDate: {
      $gte: now,
      $lte: future,
    },
  }).sort({ nextDueDate: 1 });
};

const RecurringTransaction = mongoose.models.RecurringTransaction || 
  mongoose.model<IRecurringTransaction>('RecurringTransaction', RecurringTransactionSchema);

export default RecurringTransaction;