import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { assetsRepo } from '@/lib/repos/assets';
import { z } from 'zod';

const DepreciationReportSchema = z.object({
  year: z.coerce.number().min(2000).max(2100).optional(),
});

// GET /api/assets/depreciation-report - Get depreciation report
export const GET = withAuth(async (req: NextRequest, { auth }) => {

  try {
    const searchParams = req.nextUrl.searchParams;
    const params = {
      year: searchParams.get('year'),
    };
    
    // Validate parameters
    const validationResult = DepreciationReportSchema.safeParse(params);
    if (!validationResult.success) {
      return apiResponse.badRequest('Invalid query parameters', validationResult.error);
    }
    
    const { year } = validationResult.data;
    
    const report = await assetsRepo.getDepreciationReport(auth.user.userId, year);
    
    return apiResponse.ok({
      report,
    });
  } catch (error) {
    console.error('Error generating depreciation report:', error);
    return apiResponse.serverError('Failed to generate depreciation report');
  }
});