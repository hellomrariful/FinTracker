import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth/protected-route";
import * as apiResponse from "@/lib/api-response";
import { connectDB } from "@/lib/db/mongoose";
import Income from "@/lib/models/Income";
import Employee from "@/lib/models/Employee";
import mongoose from "mongoose";

// GET /api/employees/performance - Get employee performance data
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const months = parseInt(searchParams.get("months") || "1");

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // Get income data grouped by employee
    const incomeByEmployee = await Income.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(auth.user.userId),
          date: { $gte: startDate, $lte: endDate },
          status: "completed",
          employeeId: { $exists: true },
        },
      },
      {
        $group: {
          _id: "$employeeId",
          totalIncome: { $sum: "$amount" },
          transactionCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
      },
      {
        $project: {
          id: "$_id",
          name: "$employee.name",
          role: "$employee.role",
          avatar: "$employee.avatar",
          totalIncome: 1,
          transactionCount: 1,
        },
      },
      {
        $sort: { totalIncome: -1 },
      },
    ]);

    return apiResponse.ok({
      data: incomeByEmployee,
    });
  } catch (error) {
    console.error("Error fetching employee performance:", error);
    return apiResponse.serverError("Failed to fetch employee performance");
  }
});
