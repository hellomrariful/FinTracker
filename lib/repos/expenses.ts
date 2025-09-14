import Expense, { IExpense } from '@/lib/models/Expense';
import { connectDB } from '@/lib/db/mongodb';
import mongoose from 'mongoose';
import { z } from 'zod';

// Validation schemas
export const ExpenseFiltersSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  vendor: z.string().optional(),
  platform: z.string().optional(),
  status: z.enum(['completed', 'pending', 'cancelled', 'reimbursement_pending']).optional(),
  paymentMethod: z.enum(['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash', 'Check', 'PayPal', 'Company Card', 'Other']).optional(),
  employeeId: z.string().optional(),
  projectId: z.string().optional(),
  isReimbursable: z.coerce.boolean().optional(),
  reimbursementStatus: z.enum(['pending', 'approved', 'rejected', 'paid']).optional(),
  taxDeductible: z.coerce.boolean().optional(),
  approvedBy: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  minAmount: z.coerce.number().min(0).optional(),
  maxAmount: z.coerce.number().min(0).optional(),
  tags: z.array(z.string()).or(z.string()).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.enum(['date', 'amount', 'name', 'vendor', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ExpenseFilters = z.infer<typeof ExpenseFiltersSchema>;

export const CreateExpenseSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.string().min(1),
  vendor: z.string().optional(),
  platform: z.string().optional(),
  amount: z.number().positive(),
  date: z.coerce.date(),
  paymentMethod: z.enum(['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash', 'Check', 'PayPal', 'Company Card', 'Other']),
  employeeId: z.string().optional(),
  status: z.enum(['completed', 'pending', 'cancelled', 'reimbursement_pending']).default('pending'),
  receipt: z.string().optional(),
  businessPurpose: z.string().max(500).optional(),
  projectId: z.string().optional(),
  isReimbursable: z.boolean().optional(),
  reimbursementStatus: z.enum(['pending', 'approved', 'rejected', 'paid']).optional(),
  description: z.string().max(1000).optional(),
  attachments: z.array(z.object({
    url: z.string().url(),
    pathname: z.string(),
    size: z.number(),
    contentType: z.string(),
    uploadedAt: z.coerce.date(),
  })).optional(),
  tags: z.array(z.string()).optional(),
  taxDeductible: z.boolean().optional(),
});

export const UpdateExpenseSchema = CreateExpenseSchema.partial();

export const ApprovalActionSchema = z.object({
  action: z.enum(['approve', 'reject']),
  notes: z.string().optional(),
});

export const BulkApprovalSchema = z.object({
  expenseIds: z.array(z.string()).min(1),
  action: z.enum(['approve', 'reject']),
  notes: z.string().optional(),
});

export const ReimbursementUpdateSchema = z.object({
  status: z.enum(['paid']),
  paymentDate: z.coerce.date().optional(),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
});

export class ExpenseRepository {
  private async ensureConnection() {
    await connectDB();
  }

  async find(userId: string, filters: ExpenseFilters) {
    await this.ensureConnection();
    
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };
    
    // Text search
    if (filters.q) {
      query.$or = [
        { name: { $regex: filters.q, $options: 'i' } },
        { category: { $regex: filters.q, $options: 'i' } },
        { vendor: { $regex: filters.q, $options: 'i' } },
        { platform: { $regex: filters.q, $options: 'i' } },
        { businessPurpose: { $regex: filters.q, $options: 'i' } },
        { description: { $regex: filters.q, $options: 'i' } },
        { tags: { $in: [new RegExp(filters.q, 'i')] } },
      ];
    }
    
    // Specific filters
    if (filters.category) query.category = filters.category;
    if (filters.vendor) query.vendor = filters.vendor;
    if (filters.platform) query.platform = filters.platform;
    if (filters.status) query.status = filters.status;
    if (filters.paymentMethod) query.paymentMethod = filters.paymentMethod;
    if (filters.employeeId) query.employeeId = new mongoose.Types.ObjectId(filters.employeeId);
    if (filters.projectId) query.projectId = filters.projectId;
    if (filters.isReimbursable !== undefined) query.isReimbursable = filters.isReimbursable;
    if (filters.reimbursementStatus) query.reimbursementStatus = filters.reimbursementStatus;
    if (filters.taxDeductible !== undefined) query.taxDeductible = filters.taxDeductible;
    if (filters.approvedBy) query.approvedBy = new mongoose.Types.ObjectId(filters.approvedBy);
    
    // Date range
    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = filters.startDate;
      if (filters.endDate) query.date.$lte = filters.endDate;
    }
    
    // Amount range
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      query.amount = {};
      if (filters.minAmount !== undefined) query.amount.$gte = filters.minAmount;
      if (filters.maxAmount !== undefined) query.amount.$lte = filters.maxAmount;
    }
    
    // Tags filter
    if (filters.tags) {
      const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
      query.tags = { $in: tags };
    }
    
    // Build sort
    const sort: any = {};
    sort[filters.sortBy] = filters.sortOrder === 'asc' ? 1 : -1;
    
    // Execute query
    const skip = (filters.page - 1) * filters.limit;
    
    const [expenses, total] = await Promise.all([
      Expense.find(query)
        .sort(sort)
        .skip(skip)
        .limit(filters.limit)
        .populate('employeeId', 'name email')
        .populate('approvedBy', 'name email')
        .lean(),
      Expense.countDocuments(query),
    ]);
    
    // Get aggregates
    const aggregates = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          completedAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] },
          },
          pendingAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] },
          },
          reimbursementPendingAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'reimbursement_pending'] }, '$amount', 0] },
          },
          reimbursableAmount: {
            $sum: { $cond: [{ $eq: ['$isReimbursable', true] }, '$amount', 0] },
          },
          taxDeductibleAmount: {
            $sum: { $cond: [{ $eq: ['$taxDeductible', true] }, '$amount', 0] },
          },
        },
      },
    ]);
    
    const stats = aggregates[0] || {
      totalAmount: 0,
      completedAmount: 0,
      pendingAmount: 0,
      reimbursementPendingAmount: 0,
      reimbursableAmount: 0,
      taxDeductibleAmount: 0,
    };
    
    return {
      data: expenses,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
      stats,
    };
  }

  async findById(userId: string, expenseId: string) {
    await this.ensureConnection();
    
    const expense = await Expense.findOne({
      _id: new mongoose.Types.ObjectId(expenseId),
      userId: new mongoose.Types.ObjectId(userId),
    })
      .populate('employeeId', 'name email')
      .populate('approvedBy', 'name email')
      .lean();
    
    return expense;
  }

  async create(userId: string, data: z.infer<typeof CreateExpenseSchema>) {
    await this.ensureConnection();
    
    const expense = new Expense({
      ...data,
      userId: new mongoose.Types.ObjectId(userId),
      employeeId: data.employeeId ? new mongoose.Types.ObjectId(data.employeeId) : undefined,
      // Set reimbursement status if reimbursable
      reimbursementStatus: data.isReimbursable ? 'pending' : undefined,
    });
    
    await expense.save();
    
    if (expense.employeeId) {
      await expense.populate('employeeId', 'name email');
    }
    
    return expense.toObject();
  }

  async update(userId: string, expenseId: string, data: z.infer<typeof UpdateExpenseSchema>) {
    await this.ensureConnection();
    
    const updateData: any = { ...data };
    if (data.employeeId) {
      updateData.employeeId = new mongoose.Types.ObjectId(data.employeeId);
    }
    
    // If making reimbursable, set status if not already set
    if (data.isReimbursable === true && !data.reimbursementStatus) {
      updateData.reimbursementStatus = 'pending';
    }
    
    const expense = await Expense.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(expenseId),
        userId: new mongoose.Types.ObjectId(userId),
      },
      updateData,
      { new: true, runValidators: true }
    )
      .populate('employeeId', 'name email')
      .populate('approvedBy', 'name email');
    
    return expense;
  }

  async delete(userId: string, expenseId: string) {
    await this.ensureConnection();
    
    const result = await Expense.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(expenseId),
      userId: new mongoose.Types.ObjectId(userId),
    });
    
    return result !== null;
  }

  async approveReimbursement(
    expenseId: string,
    approverId: string,
    action: 'approve' | 'reject',
    notes?: string
  ) {
    await this.ensureConnection();
    
    const updateData: any = {
      approvedBy: new mongoose.Types.ObjectId(approverId),
      approvalDate: new Date(),
      reimbursementStatus: action === 'approve' ? 'approved' : 'rejected',
    };
    
    if (notes) {
      updateData.$push = { notes: { text: notes, date: new Date(), userId: approverId } };
    }
    
    const expense = await Expense.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(expenseId),
        isReimbursable: true,
        reimbursementStatus: 'pending',
      },
      updateData,
      { new: true, runValidators: true }
    )
      .populate('employeeId', 'name email')
      .populate('approvedBy', 'name email');
    
    return expense;
  }

  async bulkApproveReimbursements(
    expenseIds: string[],
    approverId: string,
    action: 'approve' | 'reject',
    notes?: string
  ) {
    await this.ensureConnection();
    
    const updateData: any = {
      approvedBy: new mongoose.Types.ObjectId(approverId),
      approvalDate: new Date(),
      reimbursementStatus: action === 'approve' ? 'approved' : 'rejected',
    };
    
    const result = await Expense.updateMany(
      {
        _id: { $in: expenseIds.map(id => new mongoose.Types.ObjectId(id)) },
        isReimbursable: true,
        reimbursementStatus: 'pending',
      },
      updateData
    );
    
    return result.modifiedCount;
  }

  async markReimbursementPaid(
    expenseId: string,
    paymentDetails: {
      paymentDate?: Date;
      paymentMethod?: string;
      paymentReference?: string;
    }
  ) {
    await this.ensureConnection();
    
    const updateData: any = {
      reimbursementStatus: 'paid',
      ...paymentDetails,
    };
    
    const expense = await Expense.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(expenseId),
        isReimbursable: true,
        reimbursementStatus: 'approved',
      },
      updateData,
      { new: true, runValidators: true }
    )
      .populate('employeeId', 'name email')
      .populate('approvedBy', 'name email');
    
    return expense;
  }

  async getPendingReimbursements(userId?: string) {
    await this.ensureConnection();
    
    const query: any = {
      isReimbursable: true,
      reimbursementStatus: 'pending',
    };
    
    if (userId) {
      query.userId = new mongoose.Types.ObjectId(userId);
    }
    
    const expenses = await Expense.find(query)
      .populate('employeeId', 'name email')
      .sort({ date: -1 })
      .lean();
    
    return expenses;
  }

  async getStatistics(userId: string, startDate?: Date, endDate?: Date) {
    await this.ensureConnection();
    
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const dateQuery: any = {};
    
    if (startDate || endDate) {
      dateQuery.date = {};
      if (startDate) dateQuery.date.$gte = startDate;
      if (endDate) dateQuery.date.$lte = endDate;
    }
    
    const [
      totalExpenses,
      expensesByCategory,
      expensesByVendor,
      expensesByStatus,
      monthlyExpenses,
      reimbursementStats,
      taxDeductibleTotal,
    ] = await Promise.all([
      Expense.getTotalExpenses(userId, startDate, endDate),
      Expense.getExpensesByCategory(userId, startDate, endDate),
      Expense.aggregate([
        { $match: { userId: userObjectId, vendor: { $exists: true }, ...dateQuery } },
        {
          $group: {
            _id: '$vendor',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
        { $limit: 10 },
      ]),
      Expense.aggregate([
        { $match: { userId: userObjectId, ...dateQuery } },
        {
          $group: {
            _id: '$status',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
      Expense.aggregate([
        { 
          $match: { 
            userId: userObjectId, 
            status: { $in: ['completed', 'reimbursement_pending'] },
            ...dateQuery 
          } 
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
            },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 },
      ]),
      Expense.aggregate([
        { $match: { userId: userObjectId, isReimbursable: true, ...dateQuery } },
        {
          $group: {
            _id: '$reimbursementStatus',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
      Expense.aggregate([
        { $match: { userId: userObjectId, taxDeductible: true, ...dateQuery } },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]).then(res => res[0] || { total: 0, count: 0 }),
    ]);
    
    return {
      totalExpenses,
      expensesByCategory,
      expensesByVendor,
      expensesByStatus,
      monthlyExpenses,
      reimbursementStats,
      taxDeductibleTotal,
    };
  }

  async getExpensesByProject(projectId: string) {
    await this.ensureConnection();
    
    const expenses = await Expense.find({
      projectId,
    })
      .populate('employeeId', 'name email')
      .sort({ date: -1 })
      .lean();
    
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      expenses,
      total,
      count: expenses.length,
    };
  }

  async getEmployeeExpenses(employeeId: string, startDate?: Date, endDate?: Date) {
    await this.ensureConnection();
    
    const query: any = {
      employeeId: new mongoose.Types.ObjectId(employeeId),
    };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }
    
    const expenses = await Expense.find(query)
      .populate('approvedBy', 'name email')
      .sort({ date: -1 })
      .lean();
    
    const stats = {
      total: expenses.reduce((sum, expense) => sum + expense.amount, 0),
      count: expenses.length,
      pending: expenses.filter(e => e.status === 'pending').length,
      reimbursable: expenses.filter(e => e.isReimbursable).length,
      approved: expenses.filter(e => e.reimbursementStatus === 'approved').length,
    };
    
    return {
      expenses,
      stats,
    };
  }
}

export const expenseRepo = new ExpenseRepository();