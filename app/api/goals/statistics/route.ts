import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import { apiResponse } from '@/lib/utils/apiResponse';
import { goalRepo } from '@/lib/repositories/goalRepo';
import { connectDB } from '@/lib/db';

// GET /api/goals/statistics - Get goals statistics
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    await connectDB();

    const statistics = await goalRepo.getStatistics(auth.user.userId);

    return apiResponse.success(statistics, 'Goals statistics retrieved successfully');
  } catch (error: any) {
    console.error('Error fetching goals statistics:', error);
    return apiResponse.error(
      error.message || 'Failed to fetch goals statistics',
      500
    );
  }
});