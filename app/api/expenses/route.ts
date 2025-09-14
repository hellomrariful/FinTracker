import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { validateBody } from '@/lib/api-middleware';
import { expenseRepo, ExpenseFiltersSchema, CreateExpenseSchema } from '@/lib/repos/expenses';
import { z } from 'zod';

// GET /api/expenses - Fetch expenses
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    // Parse query parameters
    const { searchParams } = req.nextUrl;
    const params: any = {};
    
    // Extract all search params
    searchParams.forEach((value, key) => {
      if (key === 'tags') {
        params[key] = searchParams.getAll(key);
      } else if (key === 'isReimbursable' || key === 'taxDeductible') {
        // Handle boolean params
        params[key] = value === 'true';
      } else {
        params[key] = value;
      }
    });
    
    // Validate filters
    const validationResult = ExpenseFiltersSchema.safeParse(params);
    if (!validationResult.success) {
      return apiResponse.badRequest('Invalid query parameters', validationResult.error);
    }
    
    const filters = validationResult.data;
    
    // Get expenses with filters
    const result = await expenseRepo.find(auth.user.userId, filters);
    
    return apiResponse.ok({
      expenses: result.data,
      pagination: result.pagination,
      stats: result.stats,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return apiResponse.serverError('Failed to fetch expenses');
  }
});

// POST /api/expenses - Create expense
export const POST = withAuth(async (req: NextRequest, { auth }) => {
  try {
    const expenseData = await validateBody<z.infer<typeof CreateExpenseSchema>>(req, CreateExpenseSchema);
    
    // Create expense
    const expense = await expenseRepo.create(auth.user.userId, expenseData);
    
    return apiResponse.created({
      message: 'Expense created successfully',
      expense,
    });
  } catch (error: any) {
    console.error('Error creating expense:', error);
    
    if (error.name === 'ValidationError') {
      return apiResponse.badRequest('Validation failed', error);
    }
    
    return apiResponse.serverError('Failed to create expense');
  }
});

