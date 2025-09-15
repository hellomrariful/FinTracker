import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth/protected-route";
import * as apiResponse from "@/lib/api-response";
import { connectDB } from "@/lib/db/mongoose";
import Expense from "@/lib/models/Expense";
import mongoose from "mongoose";
import { z } from "zod";

const StatsQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
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

    // Validate query params
    const validationResult = StatsQuerySchema.safeParse(params);
    if (!validationResult.success) {
      return apiResponse.badRequest(
        "Invalid query parameters",
        validationResult.error
      );
    }

    const { startDate, endDate } = validationResult.data;

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

    // Get total expenses
    const totalExpensesResult = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, totalExpenses: { $sum: "$amount" } } },
    ]);

    const totalExpenses = totalExpensesResult[0]?.totalExpenses || 0;

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

    const statistics = {
      totalExpenses,
      expensesByCategory,
    };

    return apiResponse.ok({
      data: {
        statistics,
      },
    });
  } catch (error) {
    console.error("Error fetching expense statistics:", error);
    return apiResponse.serverError("Failed to fetch expense statistics");
  }
});
