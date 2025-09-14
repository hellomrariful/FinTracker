import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { validateBody } from '@/lib/api-middleware';
import { budgetsRepo, BudgetFiltersSchema, CreateBudgetSchema } from '@/lib/repos/budgets';
import { z } from 'zod';

// GET /api/budgets - List budgets with filtering
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    // Parse query parameters
    const { searchParams } = req.nextUrl;
    const params: any = {};
    
    // Extract all search params
    searchParams.forEach((value, key) => {
      if (key === 'tags') {
        params[key] = searchParams.getAll(key);
      } else if (key === 'isActive' || key === 'isCurrent' || key === 'hasAlerts') {
        params[key] = value === 'true';
      } else {
        params[key] = value;
      }
    });
    
    // Validate filters
    const validationResult = BudgetFiltersSchema.safeParse(params);
    if (!validationResult.success) {
      return apiResponse.badRequest('Invalid query parameters', validationResult.error);
    }
    
    const filters = validationResult.data;
    
    // Get budgets with filters
    const result = await budgetsRepo.find(auth.user.userId, filters);
    
    return apiResponse.ok({
      budgets: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return apiResponse.serverError('Failed to fetch budgets');
  }
});

// POST /api/budgets - Create new budget
export const POST = withAuth(async (req: NextRequest, { auth }) => {
  try {
    const budgetData = await validateBody<z.infer<typeof CreateBudgetSchema>>(req, CreateBudgetSchema);
    
    // Create budget
    const budget = await budgetsRepo.create(auth.user.userId, budgetData);
    
    return apiResponse.created({
      message: 'Budget created successfully',
      budget,
    });
  } catch (error: any) {
    console.error('Error creating budget:', error);
    
    if (error.message?.includes('Categories not found')) {
      return apiResponse.badRequest(error.message);
    }
    
    if (error.name === 'ValidationError') {
      return apiResponse.badRequest('Validation failed', error);
    }
    
    return apiResponse.serverError('Failed to create budget');
  }
});