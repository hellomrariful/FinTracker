import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import connectDB from '@/lib/db/mongodb';
import Income from '@/lib/models/Income';
import Expense from '@/lib/models/Expense';
import { z } from 'zod';

const querySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(5),
});

export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    // Get query params
    const { searchParams } = req.nextUrl;
    const limit = querySchema.parse({ limit: searchParams.get('limit') }).limit;

    // Connect to database
    await connectDB();

    // Get recent income and expenses
    const [income, expenses] = await Promise.all([
      Income.find({ userId: auth.user.userId })
        .sort({ date: -1, createdAt: -1 })
        .limit(limit)
        .lean(),
      Expense.find({ userId: auth.user.userId })
        .sort({ date: -1, createdAt: -1 })
        .limit(limit)
        .lean(),
    ]);

    // Combine and sort transactions
    const transactions = [
      ...income.map(inc => ({
        id: inc._id.toString(),
        name: inc.name,
        amount: inc.amount,
        date: new Date(inc.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        type: 'income' as const,
        status: inc.status,
        category: inc.category,
        source: inc.source,
      })),
      ...expenses.map(exp => ({
        id: exp._id.toString(),
        name: exp.name,
        amount: exp.amount, // Keep positive for display
        date: new Date(exp.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        type: 'expense' as const,
        status: exp.status,
        category: exp.category,
        vendor: exp.vendor,
      })),
    ]
    .sort((a, b) => {
      // Parse the formatted dates back for sorting
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, limit);

    return NextResponse.json({
      data: transactions,
      pagination: {
        limit,
        total: transactions.length,
      },
    });

  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});