import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/protected-route";
import * as apiResponse from "@/lib/api-response";
import { connectDB } from "@/lib/db/mongoose";
import Income from "@/lib/models/Income";
import Expense from "@/lib/models/Expense";
import mongoose from "mongoose";
import { z } from "zod";

const StatsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  months: z.coerce.number().optional(),
});

// GET /api/income/statistics - Get income statistics
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const params: any = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Check if requesting historical data (months parameter)
    if (params.months) {
      const months = parseInt(params.months);
      const monthlyData = [];
      const now = new Date();
      
      // Generate monthly data for the last N months
      for (let i = months - 1; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59);
        
        const monthQuery = {
          userId: new mongoose.Types.ObjectId(auth.user.userId),
          status: "completed",
          date: { $gte: monthStart, $lte: monthEnd }
        };
        
        const [incomeResult, expenseResult] = await Promise.all([
          Income.aggregate([
            { $match: monthQuery },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ]),
          Expense.aggregate([
            { $match: monthQuery },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ])
        ]);
        
        monthlyData.push({
          month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
          revenue: incomeResult[0]?.total || 0,
          expenses: expenseResult[0]?.total || 0,
        });
      }
      
      return NextResponse.json({ monthlyData });
    }

    // Parse dates if provided
    let startDate, endDate;
    if (params.startDate) startDate = new Date(params.startDate);
    if (params.endDate) {
      endDate = new Date(params.endDate);
      endDate.setHours(23, 59, 59, 999);
    }

    // Build query
    const query: any = {
      userId: new mongoose.Types.ObjectId(auth.user.userId),
      status: "completed",
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    // Get aggregated statistics
    const result = await Income.aggregate([
      { $match: query },
      { 
        $group: { 
          _id: null, 
          totalIncome: { $sum: "$amount" },
          count: { $sum: 1 },
          average: { $avg: "$amount" }
        } 
      },
    ]);

    const stats = result[0] || { totalIncome: 0, count: 0, average: 0 };
    
    // Get income by source
    const incomeBySource = await Income.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$source",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);
    
    // Get income by category
    const incomeByCategory = await Income.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Return in the format expected by the client
    return NextResponse.json({
      data: {
        statistics: {
          totalIncome: stats.totalIncome,
          incomeBySource,
          incomeByCategory,
        }
      }
    });
  } catch (error) {
    console.error("Error fetching income statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch income statistics" },
      { status: 500 }
    );
  }
});
