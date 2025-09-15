import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { budgetsRepo } from '@/lib/repos/budgets';

// POST /api/budgets/[id]/rollover - Rollover a budget to next period
export const POST = withAuth(async (req: NextRequest, { auth, params }) => {
  const { id: budgetId } = await params;
  
  try {
    const budget = await budgetsRepo.rolloverBudget(auth.user.userId, budgetId);
    
    if (!budget) {
      return apiResponse.notFound('Budget not found or rollover not enabled');
    }
    
    return apiResponse.created({
      message: 'Budget rolled over successfully',
      budget,
    });
  } catch (error) {
    console.error('Error rolling over budget:', error);
    return apiResponse.serverError('Failed to rollover budget');
  }
});