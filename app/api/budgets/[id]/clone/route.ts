import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { validateBody } from '@/lib/api-middleware';
import { budgetsRepo, CloneBudgetSchema } from '@/lib/repos/budgets';
import { z } from 'zod';

// POST /api/budgets/[id]/clone - Clone a budget
export const POST = withAuth(async (req: NextRequest, { auth, params }) => {
  const { id: budgetId } = await params;
  
  try {
    const cloneData = await validateBody<z.infer<typeof CloneBudgetSchema>>(req, CloneBudgetSchema);
    
    const budget = await budgetsRepo.clone(auth.user.userId, budgetId, cloneData);
    
    if (!budget) {
      return apiResponse.notFound('Budget not found');
    }
    
    return apiResponse.created({
      message: 'Budget cloned successfully',
      budget,
    });
  } catch (error: any) {
    console.error('Error cloning budget:', error);
    
    if (error.name === 'ValidationError') {
      return apiResponse.badRequest('Validation failed', error);
    }
    
    return apiResponse.serverError('Failed to clone budget');
  }
});