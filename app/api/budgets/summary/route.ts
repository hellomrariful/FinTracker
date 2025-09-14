import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { budgetsRepo } from '@/lib/repos/budgets';

// GET /api/budgets/summary - Get budget summary and statistics
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    const summary = await budgetsRepo.getBudgetSummary(auth.user.userId);
    
    return apiResponse.ok({
      summary,
    });
  } catch (error) {
    console.error('Error fetching budget summary:', error);
    return apiResponse.serverError('Failed to fetch budget summary');
  }
});