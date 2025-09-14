import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import { apiResponse } from '@/lib/utils/apiResponse';
import { goalRepo } from '@/lib/repositories/goalRepo';
import { updateProgressSchema } from '@/lib/validations/goal';
import { connectDB } from '@/lib/db';

// PUT /api/goals/[id]/progress - Update goal progress
export const PUT = withAuth(async (req: NextRequest, { auth, params }) => {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = updateProgressSchema.parse(body);

    const goal = await goalRepo.updateProgress(params.id, auth.user.userId, validatedData);

    return apiResponse.success(goal, 'Goal progress updated successfully');
  } catch (error: any) {
    console.error('Error updating goal progress:', error);
    
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid progress data', 400, error.errors);
    }
    
    if (error.message === 'Goal not found') {
      return apiResponse.error('Goal not found', 404);
    }
    
    return apiResponse.error(
      error.message || 'Failed to update goal progress',
      500
    );
  }
});

// POST /api/goals/[id]/progress/recalculate - Recalculate auto-tracked progress
export const POST = withAuth(async (req: NextRequest, { auth, params }) => {
  try {
    await connectDB();

    const goal = await goalRepo.recalculateAutoProgress(params.id, auth.user.userId);

    return apiResponse.success(goal, 'Goal progress recalculated successfully');
  } catch (error: any) {
    console.error('Error recalculating goal progress:', error);
    
    if (error.message === 'Goal not found') {
      return apiResponse.error('Goal not found', 404);
    }
    
    if (error.message === 'Goal does not have auto-tracking enabled') {
      return apiResponse.error(error.message, 400);
    }
    
    return apiResponse.error(
      error.message || 'Failed to recalculate goal progress',
      500
    );
  }
});