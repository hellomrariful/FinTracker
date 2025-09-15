import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/protected-route";
import { connectDB } from "@/lib/db/mongoose";
import Income from "@/lib/models/Income";
import Expense from "@/lib/models/Expense";
import Employee from "@/lib/models/Employee";
import Budget from "@/lib/models/Budget";
import Goal from "@/lib/models/Goal";

export const runtime = "nodejs";

export const GET = withAuth(async (request: NextRequest, { auth }) => {
  try {
    // Prevent execution during build
    if (!auth || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const timeFrame = searchParams.get("timeFrame") || "last-month";

    // Calculate date ranges based on timeframe
    const getDateRange = (frame: string) => {
      const now = new Date();
      let startDate: Date, endDate: Date;

      switch (frame) {
        case "daily":
          startDate = endDate = new Date(now.toISOString().split("T")[0]);
          break;
        case "last-7-days":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case "last-month":
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), 0);
          break;
        case "last-3-months":
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          endDate = now;
          break;
        case "ytd":
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = now;
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      }

      return { startDate, endDate };
    };

    const { startDate, endDate } = getDateRange(timeFrame);

    // Get previous period for comparison
    const getPreviousPeriod = () => {
      const now = new Date();
      let prevStart: Date, prevEnd: Date;

      switch (timeFrame) {
        case "last-month":
          prevStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
          prevEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0);
          break;
        case "last-3-months":
          prevStart = new Date(now.getFullYear(), now.getMonth() - 6, 1);
          prevEnd = new Date(now.getFullYear(), now.getMonth() - 3, 0);
          break;
        default:
          prevStart = prevEnd = new Date(0);
      }

      return { prevStart, prevEnd };
    };

    const { prevStart, prevEnd } = getPreviousPeriod();

    // Fetch current period data
    const [currentIncome, currentExpenses] = await Promise.all([
      Income.aggregate([
        {
          $match: {
            userId: auth.user.userId,
            date: { $gte: startDate, $lte: endDate },
            status: "completed",
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        {
          $match: {
            userId: auth.user.userId,
            date: { $gte: startDate, $lte: endDate },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    // Fetch previous period data for comparison
    const [prevIncome, prevExpenses] = await Promise.all([
      Income.aggregate([
        {
          $match: {
            userId: auth.user.userId,
            date: { $gte: prevStart, $lte: prevEnd },
            status: "completed",
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        {
          $match: {
            userId: auth.user.userId,
            date: { $gte: prevStart, $lte: prevEnd },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const totalIncome = currentIncome[0]?.total || 0;
    const totalExpenses = currentExpenses[0]?.total || 0;
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
    const roi = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;

    const previousIncome = prevIncome[0]?.total || 0;
    const previousExpenses = prevExpenses[0]?.total || 0;
    const previousProfit = previousIncome - previousExpenses;

    const revenueGrowth =
      previousIncome > 0
        ? ((totalIncome - previousIncome) / previousIncome) * 100
        : 0;
    const profitGrowth =
      previousProfit > 0
        ? ((netProfit - previousProfit) / previousProfit) * 100
        : 0;

    // Get income by category
    const incomeByCategory = await Income.aggregate([
      {
        $match: {
          userId: auth.user.userId,
          date: { $gte: startDate, $lte: endDate },
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Get expense by category
    const expenseByCategory = await Expense.aggregate([
      {
        $match: {
          userId: auth.user.userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Get top income sources
    const topIncomeSources = await Income.aggregate([
      {
        $match: {
          userId: auth.user.userId,
          date: { $gte: startDate, $lte: endDate },
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$source",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    // Get monthly revenue vs expenses for chart
    const revenueVsExpenses = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(
        endDate.getFullYear(),
        endDate.getMonth() - i,
        1
      );
      const monthEnd = new Date(
        endDate.getFullYear(),
        endDate.getMonth() - i + 1,
        0
      );

      const [monthIncome, monthExpenses] = await Promise.all([
        Income.aggregate([
          {
            $match: {
              userId: auth.user.userId,
              date: { $gte: monthStart, $lte: monthEnd },
              status: "completed",
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Expense.aggregate([
          {
            $match: {
              userId: auth.user.userId,
              date: { $gte: monthStart, $lte: monthEnd },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
      ]);

      revenueVsExpenses.push({
        month: monthStart.toLocaleDateString("en-US", { month: "short" }),
        revenue: monthIncome[0]?.total || 0,
        expenses: monthExpenses[0]?.total || 0,
      });
    }

    // Get top performing employee
    const employees = await Employee.find({ userId: auth.user.userId }).lean();
    const employeePerformance = await Promise.all(
      employees.map(async (employee) => {
        const employeeIncome = await Income.aggregate([
          {
            $match: {
              userId: auth.user.userId,
              employeeId: employee._id,
              date: { $gte: startDate, $lte: endDate },
              status: "completed",
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        return {
          _id: employee._id,
          name: employee.name,
          avatar: employee.avatar,
          totalIncome: employeeIncome[0]?.total || 0,
        };
      })
    );

    const topEmployee = employeePerformance.sort(
      (a, b) => b.totalIncome - a.totalIncome
    )[0];

    // Get active budgets and goals counts
    const [activeBudgets, activeGoals] = await Promise.all([
      Budget.countDocuments({
        userId: auth.user.userId,
        isActive: true,
      }),
      Goal.countDocuments({
        userId: auth.user.userId,
        status: "active",
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        netProfit,
        profitMargin,
        roi,
        revenueGrowth,
        profitGrowth,
        incomeByCategory: incomeByCategory.map((cat, index) => ({
          name: cat._id,
          value: cat.total,
          color: `hsl(var(--chart-${(index % 5) + 1}))`,
        })),
        expenseByCategory: expenseByCategory.map((cat, index) => ({
          name: cat._id,
          value: cat.total,
          color: `hsl(var(--chart-${(index % 5) + 1}))`,
        })),
        revenueVsExpenses,
        topIncomeSources: topIncomeSources.map((s) => [s._id, s.total]),
        topExpenseCategories: expenseByCategory
          .slice(0, 5)
          .map((c) => [c._id, c.total]),
        topEmployee: topEmployee
          ? {
              name: topEmployee.name,
              totalIncome: topEmployee.totalIncome,
              avatar: topEmployee.avatar,
            }
          : null,
        activeBudgets,
        activeGoals,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
});
