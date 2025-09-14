import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { assetsRepo } from '@/lib/repos/assets';

// GET /api/assets/statistics - Get asset statistics
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    const statistics = await assetsRepo.getStatistics(auth.user.userId);
    
    return apiResponse.ok({
      statistics,
    });
  } catch (error) {
    console.error('Error fetching asset statistics:', error);
    return apiResponse.serverError('Failed to fetch asset statistics');
  }
});