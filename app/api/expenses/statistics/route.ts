import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import { connectDB } from '@/lib/db/mongoose';
import Expense from '@/lib/models/Expense';

// GET expense statistics
export const GET = withAuth(async (request: NextRequest, { auth }) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');
    const employeeId = searchParams.get('employeeId');

    // Build query
    const query: any = { userId: auth.user.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (category) {
      query.category = category;
    }
    
    if (employeeId) {
      query.employeeId = employeeId;
    }

    // Get expenses
    const expenses = await Expense.find(query).lean();

    // Calculate statistics
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const count = expenses.length;
    const average = count > 0 ? total / count : 0;

    // Group by category
    const byCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    // Group by payment method
    const byPaymentMethod = expenses.reduce((acc, exp) => {
      acc[exp.paymentMethod] = (acc[exp.paymentMethod] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    // Get top expenses
    const topExpenses = expenses
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      total,
      count,
      average,
      byCategory,
      byPaymentMethod,
      topExpenses,
      dateRange: {
        startDate: startDate || null,
        endDate: endDate || null
      }
    });
  } catch (error) {
    console.error('Error fetching expense statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expense statistics' },
      { status: 500 }
    );
  }
});
