import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db/mongodb';
import Expense from '@/lib/models/Expense';
import { authenticateUser } from '@/lib/middleware/auth';

// Query params schema
const querySchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '20')),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.string().optional(),
  vendor: z.string().optional(),
  employeeId: z.string().optional(),
  paymentMethod: z.string().optional(),
  status: z.enum(['completed', 'pending', 'cancelled', 'reimbursement_pending']).optional(),
  reimbursable: z.string().optional().transform(v => v === undefined ? undefined : v === 'true'),
  reimbursementStatus: z.enum(['pending', 'approved', 'rejected', 'paid']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['date', 'amount', 'name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// GET /api/expenses - Fetch expenses
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    if (!authResult.authenticated) return authResult.response;

    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams);

    let validatedParams;
    try {
      validatedParams = querySchema.parse(params);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error },
        { status: 400 }
      );
    }

    const {
      page = 1,
      limit = 20,
      startDate,
      endDate,
      category,
      vendor,
      employeeId,
      paymentMethod,
      status,
      reimbursable,
      reimbursementStatus,
      search,
      sortBy = 'date',
      sortOrder = 'desc',
    } = validatedParams;

    await connectDB();

    const query: any = { userId: authResult.user!.userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (category) query.category = category;
    if (vendor) query.vendor = vendor;
    if (employeeId) query.employeeId = employeeId;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (status) query.status = status;
    if (typeof reimbursable === 'boolean') query.isReimbursable = reimbursable;
    if (reimbursementStatus) query.reimbursementStatus = reimbursementStatus;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { vendor: { $regex: search, $options: 'i' } },
        { platform: { $regex: search, $options: 'i' } },
        { businessPurpose: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [expenses, total] = await Promise.all([
      Expense.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('employeeId', 'name email')
        .lean(),
      Expense.countDocuments(query),
    ]);

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
        },
      },
    ]);

    const stats = aggregates[0] || {
      totalAmount: 0,
      completedAmount: 0,
      pendingAmount: 0,
      reimbursementPendingAmount: 0,
    };

    return NextResponse.json({
      expenses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
      stats,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/expenses - Create expense
const createExpenseSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.string().min(1),
  vendor: z.string().optional(),
  platform: z.string().optional(),
  amount: z.number().positive(),
  date: z.string().transform(str => new Date(str)),
  paymentMethod: z.enum(['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash', 'Check', 'PayPal', 'Company Card', 'Other']),
  employeeId: z.string().optional(),
  status: z.enum(['completed', 'pending', 'cancelled', 'reimbursement_pending']).default('pending'),
  receipt: z.string().optional(),
  businessPurpose: z.string().max(500).optional(),
  projectId: z.string().optional(),
  isReimbursable: z.boolean().optional(),
  reimbursementStatus: z.enum(['pending', 'approved', 'rejected', 'paid']).optional(),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  taxDeductible: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    if (!authResult.authenticated) return authResult.response;

    const body = await request.json();

    let validatedData;
    try {
      validatedData = createExpenseSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
      }
      throw error;
    }

    await connectDB();

    const expense = new Expense({
      ...validatedData,
      userId: authResult.user!.userId,
    });

    await expense.save();

    if (expense.employeeId) {
      await expense.populate('employeeId', 'name email');
    }

    return NextResponse.json({
      message: 'Expense created successfully',
      expense,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

