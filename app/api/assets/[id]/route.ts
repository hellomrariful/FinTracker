import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { validateBody } from '@/lib/api-middleware';
import { assetsRepo, UpdateAssetSchema } from '@/lib/repos/assets';
import { z } from 'zod';

// GET /api/assets/:id - Get single asset
export const GET = withAuth(async (req: NextRequest, { auth, params }) => {
  const { id: assetId } = await params;

  try {
    
    const asset = await assetsRepo.findById(auth.user.userId, assetId);
    
    if (!asset) {
      return apiResponse.notFound('Asset not found');
    }
    
    return apiResponse.ok({ asset });
  } catch (error) {
    console.error('Error fetching asset:', error);
    return apiResponse.serverError('Failed to fetch asset');
  }
});

// PATCH /api/assets/:id - Update asset
export const PATCH = withAuth(async (req: NextRequest, { auth, params }) => {
  const { id: assetId } = await params;
  
  try {
    const updateData = await validateBody<z.infer<typeof UpdateAssetSchema>>(req, UpdateAssetSchema);
    
    // Update asset
    const asset = await assetsRepo.update(auth.user.userId, assetId, updateData);
    
    if (!asset) {
      return apiResponse.notFound('Asset not found');
    }
    
    return apiResponse.ok({
      message: 'Asset updated successfully',
      asset,
    });
  } catch (error: any) {
    console.error('Error updating asset:', error);
    
    if (error.name === 'ValidationError') {
      return apiResponse.badRequest('Validation failed', error);
    }
    
    return apiResponse.serverError('Failed to update asset');
  }
});

// DELETE /api/assets/:id - Delete asset
export const DELETE = withAuth(async (req: NextRequest, { auth, params }) => {
  const { id: assetId } = await params;
  
  try {
    
    const deleted = await assetsRepo.delete(auth.user.userId, assetId);
    
    if (!deleted) {
      return apiResponse.notFound('Asset not found');
    }
    
    return apiResponse.ok({
      message: 'Asset deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return apiResponse.serverError('Failed to delete asset');
  }
});