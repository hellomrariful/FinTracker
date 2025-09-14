import BudgetV2, { IBudgetV2, ICategoryAllocation } from '@/lib/models/BudgetV2';
import { connectDB } from '@/lib/db/mongodb';
import mongoose from 'mongoose';
import { z } from 'zod';
import Expense from '@/lib/models/Expense';
import Category from '@/lib/models/Category';

// Validation schemas
const CategoryAllocationSchema = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
  limit: z.number().positive(),
  alertThreshold: z.number().min(1).max(100).optional(),
});

export const BudgetFiltersSchema = z.object({
  q: z.string().optional(),
  period: z.enum(['monthly', 'quarterly', 'yearly', 'custom']).optional(),
  isActive: z.coerce.boolean().optional(),
  isCurrent: z.coerce.boolean().optional(),
  hasAlerts: z.coerce.boolean().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  tags: z.array(z.string()).or(z.string()).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.enum(['name', 'periodStart', 'totalAmount', 'createdAt']).default('periodStart'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type BudgetFilters = z.infer<typeof BudgetFiltersSchema>;

const CreateBudgetBaseSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  period: z.enum(['monthly', 'quarterly', 'yearly', 'custom']).default('monthly'),
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
  currency: z.string().max(3).default('USD'),
  totalAmount: z.number().positive(),
  allocations: z.array(CategoryAllocationSchema).min(1),
  rollover: z.boolean().default(false),
  alertsEnabled: z.boolean().default(true),
  defaultAlertThreshold: z.number().min(1).max(100).default(80),
  tags: z.array(z.string()).optional(),
});

export const CreateBudgetSchema = CreateBudgetBaseSchema.refine(
  (data) => data.periodEnd > data.periodStart,
  { message: "Period end must be after period start", path: ["periodEnd"] }
).refine(
  (data) => {
    const totalAllocations = data.allocations.reduce((sum, alloc) => sum + alloc.limit, 0);
    return totalAllocations <= data.totalAmount;
  },
  { message: "Total category allocations cannot exceed total budget amount", path: ["allocations"] }
);

export const UpdateBudgetSchema = CreateBudgetBaseSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const CloneBudgetSchema = z.object({
  name: z.string().min(1).max(200),
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
  adjustAmount: z.number().optional(), // Percentage to adjust budget by
});

export class BudgetsRepository {
  private async ensureConnection() {
    await connectDB();
  }

  async find(userId: string, filters: BudgetFilters) {
    await this.ensureConnection();
    
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };
    
    // Text search
    if (filters.q) {
      query.$or = [
        { name: { $regex: filters.q, $options: 'i' } },
        { description: { $regex: filters.q, $options: 'i' } },
        { tags: { $in: [new RegExp(filters.q, 'i')] } },
      ];
    }
    
    // Specific filters
    if (filters.period) query.period = filters.period;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    
    // Date range filters
    if (filters.startDate || filters.endDate) {
      const dateQuery: any = {};
      if (filters.startDate) dateQuery.$gte = filters.startDate;
      if (filters.endDate) dateQuery.$lte = filters.endDate;
      query.periodStart = dateQuery;
    }
    
    // Current budgets filter
    if (filters.isCurrent) {
      const now = new Date();
      query.periodStart = { $lte: now };
      query.periodEnd = { $gte: now };
    }
    
    // Tags filter
    if (filters.tags) {
      const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
      query.tags = { $in: tags };
    }
    
    // Build sort
    const sort: any = {};
    sort[filters.sortBy] = filters.sortOrder === 'asc' ? 1 : -1;
    
    // Execute query
    const skip = (filters.page - 1) * filters.limit;
    
    const [budgets, total] = await Promise.all([
      BudgetV2.find(query)
        .sort(sort)
        .skip(skip)
        .limit(filters.limit)
        .lean(),
      BudgetV2.countDocuments(query),
    ]);
    
    // Calculate usage for each budget if current
    const enrichedBudgets = await Promise.all(
      budgets.map(async (budget: any) => {
        const now = new Date();
        const isCurrent = now >= budget.periodStart && now <= budget.periodEnd;
        
        if (isCurrent && (!budget.lastCalculatedAt || 
            new Date().getTime() - new Date(budget.lastCalculatedAt).getTime() > 3600000)) { // Recalculate if older than 1 hour
          const updated = await BudgetV2.calculateUsage(budget._id.toString());
          return updated ? updated.toObject() : budget;
        }
        
        return budget;
      })
    );
    
    // Filter for budgets with alerts if requested
    let filteredBudgets = enrichedBudgets;
    if (filters.hasAlerts) {
      filteredBudgets = enrichedBudgets.filter(budget => {
        if (!budget.alertsEnabled) return false;
        const hasOverallAlert = budget.totalSpent && budget.totalAmount && 
          (budget.totalSpent / budget.totalAmount) * 100 >= (budget.defaultAlertThreshold || 80);
        const hasCategoryAlert = budget.allocations.some((alloc: any) => {
          const threshold = alloc.alertThreshold || budget.defaultAlertThreshold || 80;
          return alloc.percentageUsed >= threshold;
        });
        return hasOverallAlert || hasCategoryAlert;
      });
    }
    
    return {
      data: filteredBudgets,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: filters.hasAlerts ? filteredBudgets.length : total,
        totalPages: Math.ceil((filters.hasAlerts ? filteredBudgets.length : total) / filters.limit),
      },
    };
  }

  async findById(userId: string, budgetId: string) {
    await this.ensureConnection();
    
    const budget = await BudgetV2.findOne({
      _id: new mongoose.Types.ObjectId(budgetId),
      userId: new mongoose.Types.ObjectId(userId),
    });
    
    if (!budget) {
      return null;
    }
    
    // Calculate latest usage
    const updated = await BudgetV2.calculateUsage(budgetId);
    return updated ? updated.toObject() : budget.toObject();
  }

  async create(userId: string, data: z.infer<typeof CreateBudgetSchema>) {
    await this.ensureConnection();
    
    // Validate categories exist
    const categoryNames = data.allocations.map(a => a.categoryName);
    const categories = await Category.find({
      userId: new mongoose.Types.ObjectId(userId),
      name: { $in: categoryNames },
    });
    
    if (categories.length !== categoryNames.length) {
      const foundNames = categories.map(c => c.name);
      const missingNames = categoryNames.filter(name => !foundNames.includes(name));
      throw new Error(`Categories not found: ${missingNames.join(', ')}`);
    }
    
    const budget = new BudgetV2({
      ...data,
      userId: new mongoose.Types.ObjectId(userId),
      totalSpent: 0,
      totalRemaining: data.totalAmount,
    });
    
    await budget.save();
    
    // Calculate initial usage
    const updated = await BudgetV2.calculateUsage((budget as any)._id.toString());
    return updated ? updated.toObject() : budget.toObject();
  }

  async update(userId: string, budgetId: string, data: z.infer<typeof UpdateBudgetSchema>) {
    await this.ensureConnection();
    
    // If updating allocations, validate categories
    if (data.allocations) {
      const categoryNames = data.allocations.map(a => a.categoryName);
      const categories = await Category.find({
        userId: new mongoose.Types.ObjectId(userId),
        name: { $in: categoryNames },
      });
      
      if (categories.length !== categoryNames.length) {
        const foundNames = categories.map(c => c.name);
        const missingNames = categoryNames.filter(name => !foundNames.includes(name));
        throw new Error(`Categories not found: ${missingNames.join(', ')}`);
      }
    }
    
    const budget = await BudgetV2.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(budgetId),
        userId: new mongoose.Types.ObjectId(userId),
      },
      data,
      { new: true, runValidators: true }
    );
    
    if (!budget) {
      return null;
    }
    
    // Recalculate usage after update
    const updated = await BudgetV2.calculateUsage(budgetId);
    return updated ? updated.toObject() : budget.toObject();
  }

  async delete(userId: string, budgetId: string) {
    await this.ensureConnection();
    
    const result = await BudgetV2.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(budgetId),
      userId: new mongoose.Types.ObjectId(userId),
    });
    
    return result !== null;
  }

  async clone(userId: string, budgetId: string, cloneData: z.infer<typeof CloneBudgetSchema>) {
    await this.ensureConnection();
    
    const originalBudget = await BudgetV2.findOne({
      _id: new mongoose.Types.ObjectId(budgetId),
      userId: new mongoose.Types.ObjectId(userId),
    });
    
    if (!originalBudget) {
      return null;
    }
    
    // Adjust amounts if percentage provided
    let newTotalAmount = originalBudget.totalAmount;
    let newAllocations = originalBudget.allocations;
    
    if (cloneData.adjustAmount) {
      const multiplier = 1 + (cloneData.adjustAmount / 100);
      newTotalAmount = Math.round(originalBudget.totalAmount * multiplier * 100) / 100;
      newAllocations = originalBudget.allocations.map((alloc: any) => ({
        ...(typeof alloc.toObject === 'function' ? alloc.toObject() : alloc),
        limit: Math.round(alloc.limit * multiplier * 100) / 100,
        spent: 0,
        remaining: undefined,
        percentageUsed: 0,
      }));
    }
    
    const newBudget = new BudgetV2({
      userId: originalBudget.userId,
      name: cloneData.name,
      description: originalBudget.description,
      period: originalBudget.period,
      periodStart: cloneData.periodStart,
      periodEnd: cloneData.periodEnd,
      currency: originalBudget.currency,
      totalAmount: newTotalAmount,
      allocations: newAllocations,
      rollover: originalBudget.rollover,
      alertsEnabled: originalBudget.alertsEnabled,
      defaultAlertThreshold: originalBudget.defaultAlertThreshold,
      tags: originalBudget.tags,
      totalSpent: 0,
      totalRemaining: newTotalAmount,
    });
    
    await newBudget.save();
    
    // Calculate initial usage
    const updated = await BudgetV2.calculateUsage((newBudget as any)._id.toString());
    return updated ? updated.toObject() : newBudget.toObject();
  }

  async getActiveBudgets(userId: string) {
    await this.ensureConnection();
    
    const budgets = await BudgetV2.getActiveBudgets(userId);
    
    // Update usage for all active budgets
    const updatedBudgets = await Promise.all(
      budgets.map(async (budget) => {
        const updated = await BudgetV2.calculateUsage((budget as any)._id.toString());
        return updated || budget;
      })
    );
    
    return updatedBudgets;
  }

  async checkAlerts(userId: string) {
    await this.ensureConnection();
    
    return await BudgetV2.checkAlerts(userId);
  }

  async getBudgetSummary(userId: string) {
    await this.ensureConnection();
    
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const now = new Date();
    
    const [
      totalBudgets,
      activeBudgets,
      currentBudgets,
      budgetStats,
    ] = await Promise.all([
      BudgetV2.countDocuments({ userId: userObjectId }),
      BudgetV2.countDocuments({ userId: userObjectId, isActive: true }),
      BudgetV2.find({
        userId: userObjectId,
        isActive: true,
        periodStart: { $lte: now },
        periodEnd: { $gte: now },
      }),
      BudgetV2.aggregate([
        { $match: { userId: userObjectId, isActive: true } },
        {
          $group: {
            _id: null,
            totalAllocated: { $sum: '$totalAmount' },
            avgBudget: { $avg: '$totalAmount' },
          },
        },
      ]),
    ]);
    
    // Calculate usage for current budgets
    let totalAllocated = 0;
    let totalSpent = 0;
    let totalRemaining = 0;
    let budgetsOverThreshold = 0;
    
    for (const budget of currentBudgets) {
      const updated = await BudgetV2.calculateUsage((budget as any)._id.toString());
      if (updated) {
        totalAllocated += updated.totalAmount;
        totalSpent += updated.totalSpent || 0;
        totalRemaining += updated.totalRemaining || 0;
        
        if (updated.isOverThreshold()) {
          budgetsOverThreshold++;
        }
      }
    }
    
    return {
      totalBudgets,
      activeBudgets,
      currentBudgets: currentBudgets.length,
      budgetsOverThreshold,
      currentPeriod: {
        totalAllocated,
        totalSpent,
        totalRemaining,
        utilizationRate: totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0,
      },
      overall: budgetStats[0] || { totalAllocated: 0, avgBudget: 0 },
    };
  }

  async getBudgetsByCategory(userId: string, categoryName: string) {
    await this.ensureConnection();
    
    const budgets = await BudgetV2.find({
      userId: new mongoose.Types.ObjectId(userId),
      'allocations.categoryName': categoryName,
      isActive: true,
    }).lean();
    
    return budgets;
  }

  async rolloverBudget(userId: string, budgetId: string) {
    await this.ensureConnection();
    
    const budget = await BudgetV2.findOne({
      _id: new mongoose.Types.ObjectId(budgetId),
      userId: new mongoose.Types.ObjectId(userId),
      rollover: true,
    });
    
    if (!budget) {
      return null;
    }
    
    // Calculate current usage
    const updated = await BudgetV2.calculateUsage(budgetId);
    if (!updated) {
      return null;
    }
    
    // Calculate new period dates based on period type
    let newPeriodStart = new Date(budget.periodEnd);
    newPeriodStart.setDate(newPeriodStart.getDate() + 1);
    
    let newPeriodEnd = new Date(newPeriodStart);
    
    switch (budget.period) {
      case 'monthly':
        newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);
        newPeriodEnd.setDate(newPeriodEnd.getDate() - 1);
        break;
      case 'quarterly':
        newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 3);
        newPeriodEnd.setDate(newPeriodEnd.getDate() - 1);
        break;
      case 'yearly':
        newPeriodEnd.setFullYear(newPeriodEnd.getFullYear() + 1);
        newPeriodEnd.setDate(newPeriodEnd.getDate() - 1);
        break;
      default:
        // For custom, use the same duration as the original
        const duration = budget.periodEnd.getTime() - budget.periodStart.getTime();
        newPeriodEnd = new Date(newPeriodStart.getTime() + duration);
    }
    
    // Create new allocations with rollover amounts
    const newAllocations = updated.allocations.map(alloc => {
      const rolloverAmount = alloc.remaining || 0;
      return {
        categoryId: alloc.categoryId,
        categoryName: alloc.categoryName,
        limit: alloc.limit + rolloverAmount,
        alertThreshold: alloc.alertThreshold,
        spent: 0,
        remaining: alloc.limit + rolloverAmount,
        percentageUsed: 0,
      };
    });
    
    // Calculate new total with rollover
    const totalRollover = updated.totalRemaining || 0;
    const newTotalAmount = budget.totalAmount + totalRollover;
    
    // Create new budget with rollover
    const newBudget = new BudgetV2({
      userId: budget.userId,
      name: `${budget.name} (Rollover)`,
      description: `Rolled over from ${budget.name} with ${totalRollover} remaining`,
      period: budget.period,
      periodStart: newPeriodStart,
      periodEnd: newPeriodEnd,
      currency: budget.currency,
      totalAmount: newTotalAmount,
      allocations: newAllocations,
      rollover: budget.rollover,
      alertsEnabled: budget.alertsEnabled,
      defaultAlertThreshold: budget.defaultAlertThreshold,
      tags: [...(budget.tags || []), 'rollover'],
      totalSpent: 0,
      totalRemaining: newTotalAmount,
    });
    
    await newBudget.save();
    
    // Mark old budget as inactive
    budget.isActive = false;
    await budget.save();
    
    return newBudget.toObject();
  }
}

export const budgetsRepo = new BudgetsRepository();