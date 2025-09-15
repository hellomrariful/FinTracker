import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/protected-route";
import * as apiResponse from "@/lib/api-response";
import { connectDB } from "@/lib/db/mongoose";
import Expense from "@/lib/models/Expense";
import mongoose from "mongoose";
import { z } from "zod";

const StatsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  groupBy: z.string().optional(),
});

// GET /api/expenses/statistics - Get expense statistics
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const params: any = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Check if requesting category grouping
    if (params.groupBy === 'category') {
      const query = {
        userId: new mongoose.Types.ObjectId(auth.user.userId),
        status: { $in: ["completed", "reimbursement_pending"] },
      };
      
      // Get expenses by category
      const categoryData = await Expense.aggregate([
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
      
      // Calculate total for percentages
      const totalAmount = categoryData.reduce((sum, cat) => sum + cat.total, 0);
      
      // Format response
      const data = categoryData.map(cat => ({
        category: cat._id || 'Uncategorized',
        total: cat.total,
        count: cat.count,
      }));
      
      return NextResponse.json({
        data,
        totalAmount,
      });
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
      status: { $in: ["completed", "reimbursement_pending"] },
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    // Get aggregated statistics
    const result = await Expense.aggregate([
      { $match: query },
      { 
        $group: { 
          _id: null, 
          totalExpenses: { $sum: "$amount" },
          count: { $sum: 1 },
          average: { $avg: "$amount" }
        } 
      },
    ]);

    const stats = result[0] || { totalExpenses: 0, count: 0, average: 0 };
    
    // Get expenses by category
    const expensesByCategory = await Expense.aggregate([
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
          totalExpenses: stats.totalExpenses,
          expensesByCategory,
        }
      }
    });
  } catch (error) {
    console.error("Error fetching expense statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch expense statistics" },
      { status: 500 }
    );
  }
});
