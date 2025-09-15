import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import * as apiResponse from '@/lib/api-response';
import { validateBody } from '@/lib/api-middleware';
import { incomeRepo, UpdateIncomeSchema } from '@/lib/repos/income';
import { z } from 'zod';

// GET /api/income/[id] - Get single income transaction
export const GET = withAuth(async (req: NextRequest, { auth, params }) => {
  const { id: incomeId } = await params;
  
  try {
    const income = await incomeRepo.findById(auth.user.userId, incomeId);
    
    if (!income) {
      return apiResponse.notFound('Income transaction not found');
    }
    
    return apiResponse.ok({ income });
  } catch (error) {
    console.error('Error fetching income:', error);
    return apiResponse.serverError('Failed to fetch income');
  }
});

// PATCH /api/income/[id] - Update income transaction  
export const PATCH = withAuth(async (req: NextRequest, { auth, params }) => {
  const { id: incomeId } = await params;
  
  try {
    const updateData = await validateBody<z.infer<typeof UpdateIncomeSchema>>(req, UpdateIncomeSchema);
    
    const income = await incomeRepo.update(auth.user.userId, incomeId, updateData);
    
    if (!income) {
      return apiResponse.notFound('Income transaction not found');
    }
    
    return apiResponse.ok({
      message: 'Income updated successfully',
      income,
    });
  } catch (error: any) {
    console.error('Error updating income:', error);
    
    if (error.name === 'ValidationError') {
      return apiResponse.badRequest('Validation failed', error);
    }
    
    return apiResponse.serverError('Failed to update income');
  }
});

// DELETE /api/income/[id] - Delete income transaction
export const DELETE = withAuth(async (req: NextRequest, { auth, params }) => {
  const { id: incomeId } = await params;
  
  try {
    const deleted = await incomeRepo.delete(auth.user.userId, incomeId);
    
    if (!deleted) {
      return apiResponse.notFound('Income transaction not found');
    }
    
    return apiResponse.ok({
      message: 'Income deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting income:', error);
    return apiResponse.serverError('Failed to delete income');
  }
});
