import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { validateBody } from '@/lib/api-middleware';
import { assetsRepo } from '@/lib/repos/assets';
import { z } from 'zod';

const BulkStatusUpdateSchema = z.object({
  assetIds: z.array(z.string()).min(1),
  status: z.enum(['active', 'inactive', 'disposed', 'maintenance']),
});

// PATCH /api/assets/bulk-status - Bulk update asset status
export const PATCH = withAuth(async (req: NextRequest, { auth }) => {
  try {
    const { assetIds, status } = await validateBody<z.infer<typeof BulkStatusUpdateSchema>>(req, BulkStatusUpdateSchema);
    
    // Update assets
    const modifiedCount = await assetsRepo.bulkUpdateStatus(auth.user.userId, assetIds, status);
    
    return apiResponse.ok({
      message: `${modifiedCount} assets updated successfully`,
      modifiedCount,
    });
  } catch (error) {
    console.error('Error bulk updating assets:', error);
    return apiResponse.serverError('Failed to update assets');
  }
});