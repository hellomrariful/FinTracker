import { NextRequest } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db/mongoose';
import Category from '@/lib/models/Category';
import Income from '@/lib/models/Income';
import Expense from '@/lib/models/Expense';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { validateBody } from '@/lib/api-middleware';
import { NotFoundError, ConflictError, ValidationError } from '@/lib/errors';
import mongoose from 'mongoose';

// Category update schema
const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.enum(['income', 'expense', 'both']).optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  icon: z.string().optional(),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});

/**
 * GET /api/categories/[id] - Get single category
 */
export const GET = withAuth(async (request, { auth, params }) => {
  const { id } = await params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid category ID');
  }
  
  await connectDB();
  
  const category = await Category.findOne({
    _id: id,
    userId: auth.user.userId,
  }).lean();
  
  if (!category) {
    throw new NotFoundError('Category', id);
  }
  
  // Get usage count
  const [incomeCount, expenseCount] = await Promise.all([
    Income.countDocuments({ userId: auth.user.userId, category: (category as any).name }),
    Expense.countDocuments({ userId: auth.user.userId, category: (category as any).name }),
  ]);
  
  return apiResponse.ok({
    ...category,
    usageCount: incomeCount + expenseCount,
    incomeCount,
    expenseCount,
  });
});

/**
 * PATCH /api/categories/[id] - Update category
 */
export const PATCH = withAuth(async (request, { auth, params }) => {
  const { id } = await params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid category ID');
  }
  
  const body = await validateBody<z.infer<typeof updateCategorySchema>>(request, updateCategorySchema);
  
  await connectDB();
  
  // Find existing category
  const existing = await Category.findOne({
    _id: id,
    userId: auth.user.userId,
  });
  
  if (!existing) {
    throw new NotFoundError('Category', id);
  }
  
  // If renaming, check for duplicates
  if (body.name && body.name !== existing.name) {
    const duplicate = await Category.findOne({
      userId: auth.user.userId,
      name: body.name,
      _id: { $ne: id },
    });
    
    if (duplicate) {
      throw new ConflictError(`Category '${body.name}' already exists`);
    }
    
    // Update all transactions with old category name
    await Promise.all([
      Income.updateMany(
        { userId: auth.user.userId, category: existing.name },
        { category: body.name }
      ),
      Expense.updateMany(
        { userId: auth.user.userId, category: existing.name },
        { category: body.name }
      ),
    ]);
  }
  
  // Update category
  const updated = await Category.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true }
  ).lean();
  
  return apiResponse.ok(updated);
});

/**
 * DELETE /api/categories/[id] - Delete category
 */
export const DELETE = withAuth(async (request, { auth, params }) => {
  const { id } = await params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid category ID');
  }
  
  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === 'true';
  const reassignTo = searchParams.get('reassignTo');
  
  await connectDB();
  
  // Find category
  const category = await Category.findOne({
    _id: id,
    userId: auth.user.userId,
  });
  
  if (!category) {
    throw new NotFoundError('Category', id);
  }
  
  // Check usage
  const [incomeCount, expenseCount] = await Promise.all([
    Income.countDocuments({ userId: auth.user.userId, category: category.name }),
    Expense.countDocuments({ userId: auth.user.userId, category: category.name }),
  ]);
  
  const totalUsage = incomeCount + expenseCount;
  
  if (totalUsage > 0 && !force && !reassignTo) {
    throw new ConflictError(
      `Category is in use by ${totalUsage} transaction(s). Use force=true to delete anyway or reassignTo=<categoryId> to reassign transactions.`,
      { incomeCount, expenseCount, totalUsage }
    );
  }
  
  // Handle reassignment
  if (reassignTo) {
    if (!mongoose.Types.ObjectId.isValid(reassignTo)) {
      throw new ValidationError('Invalid reassignment category ID');
    }
    
    const targetCategory = await Category.findOne({
      _id: reassignTo,
      userId: auth.user.userId,
    });
    
    if (!targetCategory) {
      throw new NotFoundError('Reassignment category', reassignTo);
    }
    
    // Reassign all transactions
    await Promise.all([
      Income.updateMany(
        { userId: auth.user.userId, category: category.name },
        { category: targetCategory.name }
      ),
      Expense.updateMany(
        { userId: auth.user.userId, category: category.name },
        { category: targetCategory.name }
      ),
    ]);
  } else if (force) {
    // Set transactions to 'Uncategorized'
    await Promise.all([
      Income.updateMany(
        { userId: auth.user.userId, category: category.name },
        { category: 'Uncategorized' }
      ),
      Expense.updateMany(
        { userId: auth.user.userId, category: category.name },
        { category: 'Uncategorized' }
      ),
    ]);
  }
  
  // Delete category
  await Category.findByIdAndDelete(id);
  
  return apiResponse.noContent();
});