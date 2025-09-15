import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { incomeRepo } from '@/lib/repos/income';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import Income from '@/lib/models/Income';

const StatsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  groupBy: z.enum(['day', 'week', 'month', 'year']).optional().default('month'),
});

// GET /api/income/stats - Get income statistics
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams);
    
    let validatedParams;
    try {
      validatedParams = StatsQuerySchema.parse(params);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error },
        { status: 400 }
      );
    }

    const { startDate, endDate, groupBy = 'month' } = validatedParams;

    // Connect to database
    await connectDB();

    // Build base query
    const baseQuery: any = { userId: auth.user.userId };
    
    // Add date range if provided
    if (startDate || endDate) {
      baseQuery.date = {};
      if (startDate) baseQuery.date.$gte = new Date(startDate);
      if (endDate) baseQuery.date.$lte = new Date(endDate);
    }

    // Get overall statistics
    const overallStats = await Income.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$amount' },
          totalTransactions: { $sum: 1 },
          averageTransaction: { $avg: '$amount' },
          completedIncome: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0],
            },
          },
          pendingIncome: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0],
            },
          },
          cancelledIncome: {
            $sum: {
              $cond: [{ $eq: ['$status', 'cancelled'] }, '$amount', 0],
            },
          },
          recurringCount: {
            $sum: {
              $cond: [{ $eq: ['$recurring', true] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Get income by category
    const byCategory = await Income.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Get income by source
    const bySource = await Income.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$source',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 }, // Top 10 sources
    ]);

    // Get income by payment method
    const byPaymentMethod = await Income.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Get time series data based on groupBy parameter
    let timeSeries = [];
    
    if (groupBy === 'day') {
      timeSeries = await Income.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
              day: { $dayOfMonth: '$date' },
            },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      ]);
    } else if (groupBy === 'week') {
      timeSeries = await Income.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              week: { $week: '$date' },
            },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.week': 1 } },
      ]);
    } else if (groupBy === 'month') {
      timeSeries = await Income.aggregate([
        { $match: baseQuery },
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
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]);
    } else if (groupBy === 'year') {
      timeSeries = await Income.aggregate([
        { $match: baseQuery },
        {
          $group: {
            _id: { year: { $year: '$date' } },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1 } },
      ]);
    }

    // Get recent transactions
    const recentTransactions = await Income.find(baseQuery)
      .sort({ date: -1 })
      .limit(5)
      .select('name amount date status source category')
      .lean();

    // Get top performing employees (if any)
    const topEmployees = await Income.aggregate([
      { 
        $match: { 
          ...baseQuery,
          employeeId: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: '$employeeId',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employee',
        },
      },
      { $unwind: '$employee' },
      {
        $project: {
          employeeId: '$_id',
          employeeName: '$employee.name',
          employeeEmail: '$employee.email',
          total: 1,
          count: 1,
        },
      },
    ]);

    // Calculate growth metrics
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [currentMonthIncome, lastMonthIncome] = await Promise.all([
      Income.aggregate([
        {
          $match: {
            userId: auth.user.userId,
            date: { $gte: currentMonthStart },
            status: 'completed',
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Income.aggregate([
        {
          $match: {
            userId: auth.user.userId,
            date: { $gte: lastMonthStart, $lte: lastMonthEnd },
            status: 'completed',
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const currentMonth = currentMonthIncome[0]?.total || 0;
    const lastMonth = lastMonthIncome[0]?.total || 0;
    const growth = lastMonth > 0 ? ((currentMonth - lastMonth) / lastMonth) * 100 : 0;

    return NextResponse.json({
      overview: overallStats[0] || {
        totalIncome: 0,
        totalTransactions: 0,
        averageTransaction: 0,
        completedIncome: 0,
        pendingIncome: 0,
        cancelledIncome: 0,
        recurringCount: 0,
      },
      growth: {
        currentMonth,
        lastMonth,
        percentageChange: Math.round(growth * 100) / 100,
      },
      byCategory,
      bySource,
      byPaymentMethod,
      timeSeries,
      recentTransactions,
      topEmployees,
    });
  } catch (error) {
    console.error('Error fetching income statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
