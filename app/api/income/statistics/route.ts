import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { incomeRepo } from '@/lib/repos/income';
import { z } from 'zod';

const StatsQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// GET /api/income/statistics - Get income statistics
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    const { searchParams } = req.nextUrl;
    const params: any = {};
    
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    // Validate query params
    const validationResult = StatsQuerySchema.safeParse(params);
    if (!validationResult.success) {
      return apiResponse.badRequest('Invalid query parameters', validationResult.error);
    }
    
    const { startDate, endDate } = validationResult.data;
    
    // Get statistics
    const statistics = await incomeRepo.getStatistics(auth.user.userId, startDate, endDate);
    
    // Get upcoming recurring income
    const upcomingRecurring = await incomeRepo.getUpcomingRecurring(auth.user.userId);
    
    // Get overdue income
    const overdueIncome = await incomeRepo.getOverdue(auth.user.userId);
    
    return apiResponse.ok({
      statistics,
      upcomingRecurring,
      overdueIncome,
    });
  } catch (error) {
    console.error('Error fetching income statistics:', error);
    return apiResponse.serverError('Failed to fetch income statistics');
  }
});