import Income, { IIncome } from "@/lib/models/Income";
import { connectDB } from "@/lib/db/mongodb";
import mongoose from "mongoose";
import { z } from "zod";

// Validation schemas
export const IncomeFiltersSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  source: z.string().optional(),
  platform: z.string().optional(),
  status: z.enum(["completed", "pending", "cancelled"]).optional(),
  paymentMethod: z
    .enum([
      "Bank Transfer",
      "PayPal",
      "Credit Card",
      "Stripe",
      "Check",
      "Cash",
      "Cryptocurrency",
      "Other",
    ])
    .optional(),
  employeeId: z.string().optional(),
  recurring: z.coerce.boolean().optional(),
  recurringFrequency: z
    .enum(["daily", "weekly", "monthly", "quarterly", "yearly"])
    .optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  minAmount: z.coerce.number().min(0).optional(),
  maxAmount: z.coerce.number().min(0).optional(),
  tags: z.array(z.string()).or(z.string()).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z
    .enum(["date", "amount", "name", "source", "createdAt"])
    .default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type IncomeFilters = z.infer<typeof IncomeFiltersSchema>;

export const CreateIncomeSchema = z.object({
  name: z.string().min(1).max(200),
  source: z.string().min(1).max(200),
  category: z.string().min(1),
  platform: z.string().optional(),
  amount: z.number().positive(),
  date: z.coerce.date(),
  paymentMethod: z.enum([
    "Bank Transfer",
    "PayPal",
    "Credit Card",
    "Stripe",
    "Check",
    "Cash",
    "Cryptocurrency",
    "Other",
  ]),
  employeeId: z.string().optional(),
  status: z.enum(["completed", "pending", "cancelled"]).default("pending"),
  recurring: z.boolean().optional(),
  recurringFrequency: z
    .enum(["daily", "weekly", "monthly", "quarterly", "yearly"])
    .optional(),
  description: z.string().max(1000).optional(),
  attachments: z
    .array(
      z.object({
        url: z.string().url(),
        pathname: z.string(),
        size: z.number(),
        contentType: z.string(),
        uploadedAt: z.coerce.date(),
      })
    )
    .optional(),
  tags: z.array(z.string()).optional(),
});

export const UpdateIncomeSchema = CreateIncomeSchema.partial();

export const BulkUpdateStatusSchema = z.object({
  incomeIds: z.array(z.string()).min(1),
  status: z.enum(["completed", "pending", "cancelled"]),
});

export class IncomeRepository {
  private async ensureConnection() {
    await connectDB();
  }

  async find(userId: string, filters: IncomeFilters) {
    await this.ensureConnection();

    console.log("[IncomeRepo] Finding income for user:", userId);
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const query: any = { userId: userObjectId };
    console.log("[IncomeRepo] Initial query:", JSON.stringify(query));

    // Text search
    if (filters.q) {
      query.$or = [
        { name: { $regex: filters.q, $options: "i" } },
        { source: { $regex: filters.q, $options: "i" } },
        { category: { $regex: filters.q, $options: "i" } },
        { platform: { $regex: filters.q, $options: "i" } },
        { description: { $regex: filters.q, $options: "i" } },
        { tags: { $in: [new RegExp(filters.q, "i")] } },
      ];
    }

    // Specific filters
    if (filters.category) query.category = filters.category;
    if (filters.source) query.source = filters.source;
    if (filters.platform) query.platform = filters.platform;
    if (filters.status) query.status = filters.status;
    if (filters.paymentMethod) query.paymentMethod = filters.paymentMethod;
    if (filters.employeeId)
      query.employeeId = new mongoose.Types.ObjectId(filters.employeeId);
    if (filters.recurring !== undefined) query.recurring = filters.recurring;
    if (filters.recurringFrequency)
      query.recurringFrequency = filters.recurringFrequency;

    // Date range
    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) query.date.$gte = filters.startDate;
      if (filters.endDate) query.date.$lte = filters.endDate;
    }

    // Amount range
    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
      query.amount = {};
      if (filters.minAmount !== undefined)
        query.amount.$gte = filters.minAmount;
      if (filters.maxAmount !== undefined)
        query.amount.$lte = filters.maxAmount;
    }

    // Tags filter
    if (filters.tags) {
      const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
      query.tags = { $in: tags };
    }

    // Build sort
    const sort: any = {};
    sort[filters.sortBy] = filters.sortOrder === "asc" ? 1 : -1;

    // Execute query
    const skip = (filters.page - 1) * filters.limit;
    
    console.log("[IncomeRepo] Final query before execution:", JSON.stringify(query));
    console.log("[IncomeRepo] Sort:", sort, "Skip:", skip, "Limit:", filters.limit);

    const [incomes, total] = await Promise.all([
      Income.find(query)
        .sort(sort)
        .skip(skip)
        .limit(filters.limit)
        .populate("employeeId", "name email")
        .lean(),
      Income.countDocuments(query),
    ]);
    
    console.log("[IncomeRepo] Query results - Found:", incomes.length, "Total:", total);

    // Get aggregates
    const aggregates = await Income.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          completedAmount: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0] },
          },
          pendingAmount: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] },
          },
          cancelledAmount: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, "$amount", 0] },
          },
          recurringCount: {
            $sum: { $cond: [{ $eq: ["$recurring", true] }, 1, 0] },
          },
        },
      },
    ]);

    const stats = aggregates[0] || {
      totalAmount: 0,
      completedAmount: 0,
      pendingAmount: 0,
      cancelledAmount: 0,
      recurringCount: 0,
    };

    return {
      data: incomes,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit),
      },
      stats,
    };
  }

  async findById(userId: string, incomeId: string) {
    await this.ensureConnection();

    const income = await Income.findOne({
      _id: new mongoose.Types.ObjectId(incomeId),
      userId: new mongoose.Types.ObjectId(userId),
    })
      .populate("employeeId", "name email")
      .lean();

    return income;
  }

  async create(userId: string, data: z.infer<typeof CreateIncomeSchema>) {
    await this.ensureConnection();

    const income = new Income({
      ...data,
      userId: new mongoose.Types.ObjectId(userId),
      employeeId: data.employeeId
        ? new mongoose.Types.ObjectId(data.employeeId)
        : undefined,
    });

    await income.save();

    if (income.employeeId) {
      await income.populate("employeeId", "name email");
    }

    return income.toObject();
  }

  async update(
    userId: string,
    incomeId: string,
    data: z.infer<typeof UpdateIncomeSchema>
  ) {
    await this.ensureConnection();

    const updateData: any = { ...data };
    if (data.employeeId) {
      updateData.employeeId = new mongoose.Types.ObjectId(data.employeeId);
    }

    const income = await Income.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(incomeId),
        userId: new mongoose.Types.ObjectId(userId),
      },
      updateData,
      { new: true, runValidators: true }
    ).populate("employeeId", "name email");

    return income;
  }

  async delete(userId: string, incomeId: string) {
    await this.ensureConnection();

    const result = await Income.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(incomeId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    return result !== null;
  }

  async bulkUpdateStatus(userId: string, incomeIds: string[], status: string) {
    await this.ensureConnection();

    const result = await Income.updateMany(
      {
        _id: { $in: incomeIds.map((id) => new mongoose.Types.ObjectId(id)) },
        userId: new mongoose.Types.ObjectId(userId),
      },
      { status }
    );

    return result.modifiedCount;
  }

  async getStatistics(userId: string, startDate?: Date, endDate?: Date) {
    await this.ensureConnection();

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const dateQuery: any = {};

    if (startDate || endDate) {
      dateQuery.date = {};
      if (startDate) dateQuery.date.$gte = startDate;
      if (endDate) dateQuery.date.$lte = endDate;
    }

    const [
      totalIncome,
      incomeByCategory,
      incomeBySource,
      incomeByStatus,
      monthlyIncome,
      recurringIncome,
    ] = await Promise.all([
      Income.getTotalIncome(userId, startDate, endDate),
      Income.getIncomeByCategory(userId, startDate, endDate),
      Income.aggregate([
        { $match: { userId: userObjectId, ...dateQuery } },
        {
          $group: {
            _id: "$source",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
        { $limit: 10 },
      ]),
      Income.aggregate([
        { $match: { userId: userObjectId, ...dateQuery } },
        {
          $group: {
            _id: "$status",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
      Income.aggregate([
        { $match: { userId: userObjectId, status: "completed", ...dateQuery } },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
            },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 12 },
      ]),
      Income.aggregate([
        { $match: { userId: userObjectId, recurring: true, ...dateQuery } },
        {
          $group: {
            _id: "$recurringFrequency",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    return {
      totalIncome,
      incomeByCategory,
      incomeBySource,
      incomeByStatus,
      monthlyIncome,
      recurringIncome,
    };
  }

  async getUpcomingRecurring(userId: string) {
    await this.ensureConnection();

    const income = await Income.find({
      userId: new mongoose.Types.ObjectId(userId),
      recurring: true,
      status: "pending",
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(10)
      .lean();

    return income;
  }

  async getOverdue(userId: string) {
    await this.ensureConnection();

    const income = await Income.find({
      userId: new mongoose.Types.ObjectId(userId),
      status: "pending",
      date: { $lt: new Date() },
    })
      .sort({ date: -1 })
      .lean();

    return income;
  }
}

export const incomeRepo = new IncomeRepository();
