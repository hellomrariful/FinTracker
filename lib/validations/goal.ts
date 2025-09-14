import { z } from 'zod';

// Milestone schema
export const milestoneSchema = z.object({
  name: z.string().min(1).max(100),
  targetAmount: z.number().min(0),
  targetDate: z.string().transform(str => new Date(str)),
  completed: z.boolean().optional().default(false),
  completedDate: z.string().transform(str => new Date(str)).optional(),
  notes: z.string().max(500).optional(),
});

// Tracking rules schema
export const trackingRulesSchema = z.object({
  categories: z.array(z.string()).optional(),
  excludeCategories: z.array(z.string()).optional(),
  sources: z.array(z.string()).optional(),
  transactionTypes: z.array(z.enum(['income', 'expense'])).optional(),
  startDate: z.string().transform(str => new Date(str)).optional(),
  endDate: z.string().transform(str => new Date(str)).optional(),
});

// Goal filter schema
export const goalFilterSchema = z.object({
  status: z.union([
    z.string(),
    z.array(z.string()),
  ]).optional(),
  type: z.union([
    z.string(),
    z.array(z.string()),
  ]).optional(),
  priority: z.union([
    z.string(),
    z.array(z.string()),
  ]).optional(),
  category: z.string().optional(),
  isOverdue: z.string().transform(val => val === 'true').optional(),
  isOnTrack: z.string().transform(val => val === 'true').optional(),
  needsAttention: z.string().transform(val => val === 'true').optional(),
  dateFrom: z.string().transform(str => new Date(str)).optional(),
  dateTo: z.string().transform(str => new Date(str)).optional(),
  searchTerm: z.string().optional(),
  tags: z.union([
    z.string().transform(str => str.split(',')),
    z.array(z.string()),
  ]).optional(),
  page: z.string().transform(Number).optional().default('1'),
  limit: z.string().transform(Number).optional().default('20'),
  sortBy: z.string().optional().default('deadline'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

// Create goal schema
export const createGoalSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(['savings', 'investment', 'debt_payoff', 'revenue', 'expense_reduction', 'emergency_fund', 'custom']),
  targetAmount: z.number().min(0.01),
  initialAmount: z.number().min(0).optional().default(0),
  currency: z.string().max(3).optional().default('USD'),
  deadline: z.string().transform(str => new Date(str)),
  startDate: z.string().transform(str => new Date(str)).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional().default('medium'),
  status: z.enum(['draft', 'active', 'completed', 'paused', 'failed', 'cancelled']).optional().default('draft'),
  category: z.string().optional(),
  milestones: z.array(milestoneSchema).optional(),
  autoTrack: z.boolean().optional().default(false),
  trackingRules: trackingRulesSchema.optional(),
  reminderEnabled: z.boolean().optional().default(true),
  reminderFrequency: z.enum(['daily', 'weekly', 'bi-weekly', 'monthly']).optional().default('weekly'),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string()).optional(),
});

// Update goal schema
export const updateGoalSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  type: z.enum(['savings', 'investment', 'debt_payoff', 'revenue', 'expense_reduction', 'emergency_fund', 'custom']).optional(),
  targetAmount: z.number().min(0.01).optional(),
  currentAmount: z.number().min(0).optional(),
  initialAmount: z.number().min(0).optional(),
  currency: z.string().max(3).optional(),
  deadline: z.string().transform(str => new Date(str)).optional(),
  startDate: z.string().transform(str => new Date(str)).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z.enum(['draft', 'active', 'completed', 'paused', 'failed', 'cancelled']).optional(),
  category: z.string().optional(),
  milestones: z.array(milestoneSchema).optional(),
  autoTrack: z.boolean().optional(),
  trackingRules: trackingRulesSchema.optional(),
  reminderEnabled: z.boolean().optional(),
  reminderFrequency: z.enum(['daily', 'weekly', 'bi-weekly', 'monthly']).optional(),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string()).optional(),
  attachments: z.array(z.object({
    url: z.string(),
    pathname: z.string(),
    size: z.number(),
    contentType: z.string(),
    uploadedAt: z.string().transform(str => new Date(str)),
  })).optional(),
});

// Progress update schema
export const updateProgressSchema = z.object({
  amount: z.number(),
  source: z.enum(['manual', 'auto', 'milestone']).optional().default('manual'),
  description: z.string().optional(),
  transactionId: z.string().optional(),
});

// Bulk delete schema
export const bulkDeleteSchema = z.object({
  goalIds: z.array(z.string()),
});

// Add milestone schema
export const addMilestoneSchema = milestoneSchema;

// Update milestone schema
export const updateMilestoneSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  targetAmount: z.number().min(0).optional(),
  targetDate: z.string().transform(str => new Date(str)).optional(),
  completed: z.boolean().optional(),
  completedDate: z.string().transform(str => new Date(str)).optional(),
  notes: z.string().max(500).optional(),
});

// Milestone index schema
export const milestoneIndexSchema = z.object({
  index: z.string().transform(Number),
});