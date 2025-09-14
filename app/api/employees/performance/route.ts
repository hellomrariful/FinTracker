import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import connectDB from '@/lib/db/mongodb';
import Employee from '@/lib/models/Employee';
import Income from '@/lib/models/Income';
import { z } from 'zod';

const querySchema = z.object({
  months: z.coerce.number().min(1).max(12).default(1),
});

export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    // Get query params
    const { searchParams } = req.nextUrl;
    const months = querySchema.parse({ months: searchParams.get('months') }).months;

    // Connect to database
    await connectDB();

    // Calculate date ranges
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    const startDate = new Date(currentYear, currentMonth - months + 1, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);

    const previousStartDate = new Date(currentYear, currentMonth - (months * 2) + 1, 1);
    const previousEndDate = new Date(currentYear, currentMonth - months, 0);

    // Get all employees
    const employees = await Employee.find({ userId: auth.user.userId }).lean();

    // Get income data for each employee
    const employeePerformance = await Promise.all(
      employees.map(async (employee) => {
        // Current period income
        const currentIncome = await Income.aggregate([
          {
            $match: {
              userId: auth.user.userId,
              employeeId: employee._id,
              date: { $gte: startDate, $lte: endDate },
              status: 'completed'
            }
          },
          {
            $group: {
              _id: null,
              totalIncome: { $sum: '$amount' },
              transactions: { $sum: 1 },
              avgPerTransaction: { $avg: '$amount' }
            }
          }
        ]);

        // Previous period income for growth calculation
        const previousIncome = await Income.aggregate([
          {
            $match: {
              userId: auth.user.userId,
              employeeId: employee._id,
              date: { $gte: previousStartDate, $lte: previousEndDate },
              status: 'completed'
            }
          },
          {
            $group: {
              _id: null,
              totalIncome: { $sum: '$amount' }
            }
          }
        ]);

        const current = currentIncome[0] || { totalIncome: 0, transactions: 0, avgPerTransaction: 0 };
        const previous = previousIncome[0] || { totalIncome: 0 };

        // Calculate growth percentage
        const growth = previous.totalIncome > 0
          ? ((current.totalIncome - previous.totalIncome) / previous.totalIncome) * 100
          : 0;

        return {
          id: (employee._id as any).toString(),
          name: employee.name,
          role: employee.role,
          avatar: employee.avatar,
          totalIncome: current.totalIncome,
          transactions: current.transactions,
          avgPerTransaction: current.avgPerTransaction,
          growth,
        };
      })
    );

    // Sort by total income descending
    employeePerformance.sort((a, b) => b.totalIncome - a.totalIncome);

    return NextResponse.json({
      data: employeePerformance,
      metadata: {
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        previousPeriod: {
          start: previousStartDate.toISOString(),
          end: previousEndDate.toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Error fetching employee performance:', error);
    
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