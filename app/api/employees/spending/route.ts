import { NextRequest } from "next/server";
import { withAuth } from "@/lib/auth/protected-route";
import * as apiResponse from "@/lib/api-response";
import { connectDB } from "@/lib/db/mongoose";
import Expense from "@/lib/models/Expense";
import Employee from "@/lib/models/Employee";
import mongoose from "mongoose";

// GET /api/employees/spending - Get employee spending data
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const months = parseInt(searchParams.get("months") || "1");

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // Get expense data grouped by employee
    const expensesByEmployee = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(auth.user.userId),
          date: { $gte: startDate, $lte: endDate },
          status: { $in: ["completed", "reimbursement_pending"] },
          employeeId: { $exists: true },
        },
      },
      {
        $group: {
          _id: "$employeeId",
          totalSpent: { $sum: "$amount" },
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
          totalSpent: 1,
          transactionCount: 1,
        },
      },
      {
        $sort: { totalSpent: -1 },
      },
    ]);

    return apiResponse.ok({
      data: expensesByEmployee,
    });
  } catch (error) {
    console.error("Error fetching employee spending:", error);
    return apiResponse.serverError("Failed to fetch employee spending");
  }
});
