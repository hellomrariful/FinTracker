import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { validateBody } from '@/lib/api-middleware';
import { assetsRepo, AssetFiltersSchema, CreateAssetSchema } from '@/lib/repos/assets';
import { z } from 'zod';

// GET /api/assets - List assets with filtering
export const GET = withAuth(async (req: NextRequest, { auth }) => {

  try {
    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const params: any = {};
    
    // Extract all search params
    searchParams.forEach((value, key) => {
      if (key === 'tags') {
        // Handle tags as array
        params[key] = searchParams.getAll(key);
      } else {
        params[key] = value;
      }
    });
    
    // Validate filters
    const validationResult = AssetFiltersSchema.safeParse(params);
    if (!validationResult.success) {
      return apiResponse.badRequest('Invalid query parameters', validationResult.error);
    }
    
    const filters = validationResult.data;
    
    // Get assets with pagination
    const result = await assetsRepo.find(auth.user.userId, filters);
    
    return apiResponse.ok({
      assets: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return apiResponse.serverError('Failed to fetch assets');
  }
});

// POST /api/assets - Create new asset
export const POST = withAuth(async (req: NextRequest, { auth }) => {
  try {
    const assetData = await validateBody<z.infer<typeof CreateAssetSchema>>(req, CreateAssetSchema);
    
    // Create asset
    const asset = await assetsRepo.create(auth.user.userId, assetData);
    
    return apiResponse.created({
      message: 'Asset created successfully',
      asset,
    });
  } catch (error: any) {
    console.error('Error creating asset:', error);
    
    if (error.name === 'ValidationError') {
      return apiResponse.badRequest('Validation failed', error);
    }
    
    return apiResponse.serverError('Failed to create asset');
  }
});