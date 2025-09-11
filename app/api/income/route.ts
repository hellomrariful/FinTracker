import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db/mongodb';
import Income from '@/lib/models/Income';
import { authenticateUser } from '@/lib/middleware/auth';

// Query params schema
const querySchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '20')),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  category: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(['completed', 'pending', 'cancelled']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['date', 'amount', 'name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// GET /api/income - Fetch all income transactions
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateUser(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    // Parse query parameters
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
      source,
      status,
      search,
      sortBy = 'date',
      sortOrder = 'desc',
    } = validatedParams;

    // Connect to database
    await connectDB();

    // Build query
    const query: any = { userId: authResult.user!.userId };

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Source filter
    if (source) {
      query.source = source;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Search filter (searches in name, source, and category)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [transactions, total] = await Promise.all([
      Income.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('employeeId', 'name email')
        .lean(),
      Income.countDocuments(query),
    ]);

    // Calculate aggregates
    const aggregates = await Income.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          completedAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0],
            },
          },
          pendingAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0],
            },
          },
        },
      },
    ]);

    const stats = aggregates[0] || {
      totalAmount: 0,
      completedAmount: 0,
      pendingAmount: 0,
    };

    // Return response
    return NextResponse.json({
      transactions,
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
    console.error('Error fetching income transactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/income - Create new income transaction
const createIncomeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  source: z.string().min(1, 'Source is required').max(200),
  category: z.string().min(1, 'Category is required'),
  platform: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  date: z.string().transform(str => new Date(str)),
  paymentMethod: z.enum(['Bank Transfer', 'PayPal', 'Credit Card', 'Stripe', 'Check', 'Cash', 'Cryptocurrency', 'Other']),
  employeeId: z.string().optional(),
  status: z.enum(['completed', 'pending', 'cancelled']).default('pending'),
  recurring: z.boolean().optional(),
  recurringFrequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).optional(),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateUser(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    // Parse and validate request body
    const body = await request.json();
    
    let validatedData;
    try {
      validatedData = createIncomeSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

    // Connect to database
    await connectDB();

    // Create income transaction
    const income = new Income({
      ...validatedData,
      userId: authResult.user!.userId,
    });

    await income.save();

    // Populate employee details if present
    if (income.employeeId) {
      await income.populate('employeeId', 'name email');
    }

    return NextResponse.json(
      {
        message: 'Income transaction created successfully',
        transaction: income,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating income transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
