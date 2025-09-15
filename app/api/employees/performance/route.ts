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

    // Get income data grouped by employee for current period
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
          transactions: { $sum: 1 },
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
        $sort: { totalIncome: -1 },
      },
      {
        $limit: 5, // Top 5 employees
      },
    ]);

    // Calculate growth for each employee
    const prevStartDate = new Date(startDate);
    prevStartDate.setMonth(prevStartDate.getMonth() - months);
    const prevEndDate = new Date(startDate);

    const performanceData = await Promise.all(
      incomeByEmployee.map(async (emp) => {
        // Get previous period income
        const prevIncome = await Income.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(auth.user.userId),
              employeeId: emp._id,
              date: { $gte: prevStartDate, $lt: prevEndDate },
              status: "completed",
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]);

        const previousTotal = prevIncome[0]?.total || 0;
        const growth = previousTotal > 0 
          ? ((emp.totalIncome - previousTotal) / previousTotal) * 100 
          : 0;

        return {
          id: emp._id.toString(),
          name: emp.employee.name,
          role: emp.employee.role || 'Employee',
          avatar: emp.employee.avatar,
          totalIncome: emp.totalIncome,
          transactions: emp.transactions,
          growth: Math.round(growth * 10) / 10, // Round to 1 decimal
        };
      })
    );

    return apiResponse.ok({
      data: performanceData,
    });
  } catch (error) {
    console.error("Error fetching employee performance:", error);
    return apiResponse.serverError("Failed to fetch employee performance");
  }
});
