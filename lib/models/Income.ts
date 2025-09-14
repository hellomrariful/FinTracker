import mongoose, { Document, Schema } from 'mongoose';

export interface IIncome extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  source: string;
  category: string;
  platform?: string;
  amount: number;
  date: Date;
  paymentMethod: string;
  employeeId?: mongoose.Types.ObjectId;
  status: 'completed' | 'pending' | 'cancelled';
  recurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  description?: string;
  attachments?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  // Instance methods
  isOverdue(): boolean;
}

export interface IIncomeModel extends mongoose.Model<IIncome> {
  getTotalIncome(userId: string, startDate?: Date, endDate?: Date): Promise<number>;
  getIncomeByCategory(userId: string, startDate?: Date, endDate?: Date): Promise<any[]>;
}

const incomeSchema = new Schema<IIncome>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Income name is required'],
    trim: true,
    maxlength: [200, 'Income name cannot exceed 200 characters'],
  },
  source: {
    type: String,
    required: [true, 'Income source is required'],
    trim: true,
    maxlength: [200, 'Source name cannot exceed 200 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  platform: {
    type: String,
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    index: true,
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['Bank Transfer', 'PayPal', 'Credit Card', 'Stripe', 'Check', 'Cash', 'Cryptocurrency', 'Other'],
  },
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'cancelled'],
    default: 'pending',
    index: true,
  },
  recurring: {
    type: Boolean,
    default: false,
  },
  recurringFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  attachments: [{
    type: String,
  }],
  tags: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: true,
});

// Indexes for better query performance
incomeSchema.index({ userId: 1, date: -1 });
incomeSchema.index({ userId: 1, category: 1 });
incomeSchema.index({ userId: 1, status: 1 });
incomeSchema.index({ userId: 1, source: 1 });

// Virtual for formatted amount
incomeSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(this.amount);
});

// Method to check if income is overdue
incomeSchema.methods.isOverdue = function() {
  return this.status === 'pending' && this.date < new Date();
};

// Static method to get total income for a user
incomeSchema.statics.getTotalIncome = async function(
  userId: string,
  startDate?: Date,
  endDate?: Date
) {
  const query: any = { userId, status: 'completed' };
  
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }
  
  const result = await this.aggregate([
    { $match: query },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  
  return result[0]?.total || 0;
};

// Static method to get income by category
incomeSchema.statics.getIncomeByCategory = async function(
  userId: string,
  startDate?: Date,
  endDate?: Date
) {
  const query: any = { userId, status: 'completed' };
  
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }
  
  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { total: -1 } },
  ]);
};

const Income = (mongoose.models.Income || mongoose.model<IIncome, IIncomeModel>('Income', incomeSchema)) as IIncomeModel;

export default Income;
