import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { budgetsRepo } from '@/lib/repos/budgets';

// GET /api/budgets/active - Get all active budgets with current usage
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    const budgets = await budgetsRepo.getActiveBudgets(auth.user.userId);
    
    return apiResponse.ok({
      budgets,
      count: budgets.length,
    });
  } catch (error) {
    console.error('Error fetching active budgets:', error);
    return apiResponse.serverError('Failed to fetch active budgets');
  }
});