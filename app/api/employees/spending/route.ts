import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import { connectDB } from '@/lib/db/mongoose';
import Expense from '@/lib/models/Expense';
import Employee from '@/lib/models/Employee';

// GET employee spending statistics
export const GET = withAuth(async (request: NextRequest, { auth }) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get('months') || '1');
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // Get all employees
    const employees = await Employee.find({ userId: auth.user.userId }).lean();
    
    // Get expenses within date range
    const expenses = await Expense.find({
      userId: auth.user.userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).lean();

    // Calculate spending per employee
    const employeeSpending = employees.map(employee => {
      const employeeExpenses = expenses.filter(exp => 
        exp.employeeId?.toString() === String(employee._id)
      );
      
      const totalSpent = employeeExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      return {
        id: employee._id,
        name: employee.name,
        role: employee.role,
        avatar: employee.avatar,
        totalSpent,
        expenseCount: employeeExpenses.length
      };
    });

    // Sort by total spent (descending)
    employeeSpending.sort((a, b) => b.totalSpent - a.totalSpent);

    return NextResponse.json({ 
      success: true, 
      data: employeeSpending,
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching employee spending:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee spending' },
      { status: 500 }
    );
  }
});
