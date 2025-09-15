import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { budgetsRepo } from '@/lib/repos/budgets';

// GET /api/budgets/alerts - Get budget alerts for the user
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    const alerts = await budgetsRepo.checkAlerts(auth.user.userId);
    
    return apiResponse.ok({
      alerts,
      count: alerts.length,
    });
  } catch (error) {
    console.error('Error fetching budget alerts:', error);
    return apiResponse.serverError('Failed to fetch budget alerts');
  }
});