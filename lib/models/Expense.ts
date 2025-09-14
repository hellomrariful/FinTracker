import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  vendor?: string;
  platform?: string;
  amount: number;
  date: Date;
  paymentMethod: string;
  employeeId?: mongoose.Types.ObjectId;
  status: 'completed' | 'pending' | 'cancelled' | 'reimbursement_pending';
  receipt?: string;
  businessPurpose?: string;
  projectId?: string;
  isReimbursable?: boolean;
  reimbursementStatus?: 'pending' | 'approved' | 'rejected' | 'paid';
  approvedBy?: mongoose.Types.ObjectId;
  approvalDate?: Date;
  description?: string;
  attachments?: string[];
  tags?: string[];
  taxDeductible?: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Instance methods
  needsApproval(): boolean;
}

export interface IExpenseModel extends mongoose.Model<IExpense> {
  getTotalExpenses(userId: string, startDate?: Date, endDate?: Date): Promise<number>;
  getExpensesByCategory(userId: string, startDate?: Date, endDate?: Date): Promise<any[]>;
  getPendingReimbursements(userId?: string): Promise<IExpense[]>;
}

const expenseSchema = new Schema<IExpense>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Expense name is required'],
    trim: true,
    maxlength: [200, 'Expense name cannot exceed 200 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  vendor: {
    type: String,
    trim: true,
    maxlength: [200, 'Vendor name cannot exceed 200 characters'],
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
    enum: ['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash', 'Check', 'PayPal', 'Company Card', 'Other'],
  },
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'cancelled', 'reimbursement_pending'],
    default: 'pending',
    index: true,
  },
  receipt: {
    type: String,
  },
  businessPurpose: {
    type: String,
    maxlength: [500, 'Business purpose cannot exceed 500 characters'],
  },
  projectId: {
    type: String,
  },
  isReimbursable: {
    type: Boolean,
    default: false,
  },
  reimbursementStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paid'],
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  approvalDate: {
    type: Date,
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
  taxDeductible: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });
expenseSchema.index({ userId: 1, status: 1 });
expenseSchema.index({ userId: 1, vendor: 1 });
expenseSchema.index({ userId: 1, isReimbursable: 1, reimbursementStatus: 1 });

// Virtual for formatted amount
expenseSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(this.amount);
});

// Method to check if expense needs approval
expenseSchema.methods.needsApproval = function() {
  return this.isReimbursable && this.reimbursementStatus === 'pending';
};

// Static method to get total expenses for a user
expenseSchema.statics.getTotalExpenses = async function(
  userId: string,
  startDate?: Date,
  endDate?: Date
) {
  const query: any = { userId, status: { $in: ['completed', 'reimbursement_pending'] } };
  
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

// Static method to get expenses by category
expenseSchema.statics.getExpensesByCategory = async function(
  userId: string,
  startDate?: Date,
  endDate?: Date
) {
  const query: any = { userId, status: { $in: ['completed', 'reimbursement_pending'] } };
  
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
        avgAmount: { $avg: '$amount' },
      },
    },
    { $sort: { total: -1 } },
  ]);
};

// Static method to get pending reimbursements
expenseSchema.statics.getPendingReimbursements = async function(userId?: string) {
  const query: any = { 
    isReimbursable: true, 
    reimbursementStatus: 'pending' 
  };
  
  if (userId) query.userId = userId;
  
  return this.find(query)
    .populate('employeeId', 'name email')
    .sort({ date: -1 });
};

const Expense = (mongoose.models.Expense || mongoose.model<IExpense, IExpenseModel>('Expense', expenseSchema)) as IExpenseModel;

export default Expense;
