import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { validateBody } from '@/lib/api-middleware';
import { budgetsRepo, UpdateBudgetSchema } from '@/lib/repos/budgets';
import { z } from 'zod';

// GET /api/budgets/[id] - Get single budget with calculated usage
export const GET = withAuth(async (req: NextRequest, { auth, params }) => {
  const { id: budgetId } = await params;
  
  try {
    const budget = await budgetsRepo.findById(auth.user.userId, budgetId);
    
    if (!budget) {
      return apiResponse.notFound('Budget not found');
    }
    
    return apiResponse.ok({ budget });
  } catch (error) {
    console.error('Error fetching budget:', error);
    return apiResponse.serverError('Failed to fetch budget');
  }
});

// PATCH /api/budgets/[id] - Update budget
export const PATCH = withAuth(async (req: NextRequest, { auth, params }) => {
  const { id: budgetId } = await params;
  
  try {
    const updateData = await validateBody<z.infer<typeof UpdateBudgetSchema>>(req, UpdateBudgetSchema);
    
    const budget = await budgetsRepo.update(auth.user.userId, budgetId, updateData);
    
    if (!budget) {
      return apiResponse.notFound('Budget not found');
    }
    
    return apiResponse.ok({
      message: 'Budget updated successfully',
      budget,
    });
  } catch (error: any) {
    console.error('Error updating budget:', error);
    
    if (error.message?.includes('Categories not found')) {
      return apiResponse.badRequest(error.message);
    }
    
    if (error.name === 'ValidationError') {
      return apiResponse.badRequest('Validation failed', error);
    }
    
    return apiResponse.serverError('Failed to update budget');
  }
});

// DELETE /api/budgets/[id] - Delete budget
export const DELETE = withAuth(async (req: NextRequest, { auth, params }) => {
  const { id: budgetId } = await params;
  
  try {
    const deleted = await budgetsRepo.delete(auth.user.userId, budgetId);
    
    if (!deleted) {
      return apiResponse.notFound('Budget not found');
    }
    
    return apiResponse.ok({
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return apiResponse.serverError('Failed to delete budget');
  }
});