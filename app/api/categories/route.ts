import { NextRequest } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db/mongoose';
import Category from '@/lib/models/Category';
import Income from '@/lib/models/Income';
import Expense from '@/lib/models/Expense';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { 
  validateBody, 
  parsePagination,
  parseSort,
} from '@/lib/api-middleware';
import { NotFoundError, ConflictError } from '@/lib/errors';

// Category creation schema
const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['income', 'expense', 'both']),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  icon: z.string().optional(),
  description: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
});

// Category update schema
const updateCategorySchema = createCategorySchema.partial();

/**
 * GET /api/categories - Get all categories for user
 */
export const GET = withAuth(async (request, { auth }) => {
  await connectDB();
  
  const { searchParams } = new URL(request.url);
  const { page, limit, skip } = parsePagination(request);
  const { sortBy, sortOrder } = parseSort(request, 'name', 'asc');
  
  // Build query
  const query: any = { userId: auth.user.userId };
  
  // Filter by type
  const type = searchParams.get('type');
  if (type && ['income', 'expense', 'both'].includes(type)) {
    query.type = type;
  }
  
  // Filter by active status
  const isActive = searchParams.get('active');
  if (isActive !== null) {
    query.isActive = isActive === 'true';
  }
  
  // Search by name
  const search = searchParams.get('q') || searchParams.get('search');
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  
  // Execute query
  const [categories, total] = await Promise.all([
    Category.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Category.countDocuments(query),
  ]);
  
  // Get usage counts for each category
  const categoryIds = categories.map(c => c._id);
  const [incomeUsage, expenseUsage] = await Promise.all([
    Income.aggregate([
      { $match: { userId: auth.user.userId, category: { $in: categories.map(c => c.name) } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]),
    Expense.aggregate([
      { $match: { userId: auth.user.userId, category: { $in: categories.map(c => c.name) } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]),
  ]);
  
  // Create usage map
  const usageMap = new Map();
  incomeUsage.forEach(u => {
    usageMap.set(u._id, (usageMap.get(u._id) || 0) + u.count);
  });
  expenseUsage.forEach(u => {
    usageMap.set(u._id, (usageMap.get(u._id) || 0) + u.count);
  });
  
  // Add usage count to categories
  const categoriesWithUsage = categories.map(category => ({
    ...category,
    usageCount: usageMap.get(category.name) || 0,
  }));
  
  return apiResponse.paginated(categoriesWithUsage, page, limit, total);
});

/**
 * POST /api/categories - Create new category
 */
export const POST = withAuth(async (request, { auth }) => {
  const body = await validateBody<z.infer<typeof createCategorySchema>>(request, createCategorySchema);
  
  await connectDB();
  
  // Normalize input
  const name = body.name.trim();

  // Check if category with same name and type exists for user (case-insensitive)
  const existing = await Category.findOne({
    userId: auth.user.userId,
    type: body.type,
    name: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
  });
  
  if (existing) {
    throw new ConflictError(`Category '${name}' already exists`);
  }
  
  // Create category
  const category = await Category.create({
    ...body,
    name,
    userId: auth.user.userId,
  });
  
  return apiResponse.created(category);
});
