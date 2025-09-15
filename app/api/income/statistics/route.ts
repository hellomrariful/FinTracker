import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth/protected-route";
import * as apiResponse from "@/lib/api-response";
import { connectDB } from "@/lib/db/mongoose";
import Income from "@/lib/models/Income";
import mongoose from "mongoose";
import { z } from "zod";

const StatsQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
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
      status: "completed",
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    // Get total income
    const totalIncomeResult = await Income.aggregate([
      { $match: query },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } },
    ]);

    const totalIncome = totalIncomeResult[0]?.totalIncome || 0;

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

    const statistics = {
      totalIncome,
      incomeByCategory,
      incomeBySource,
    };

    return apiResponse.ok({
      data: {
        statistics,
      },
    });
  } catch (error) {
    console.error("Error fetching income statistics:", error);
    return apiResponse.serverError("Failed to fetch income statistics");
  }
});
