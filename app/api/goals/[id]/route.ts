import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import { apiResponse } from '@/lib/utils/apiResponse';
import { goalRepo } from '@/lib/repositories/goalRepo';
import { updateGoalSchema } from '@/lib/validations/goal';
import { connectDB } from '@/lib/db';

// GET /api/goals/[id] - Get single goal
export const GET = withAuth(async (req: NextRequest, { auth, params }) => {
  try {
    await connectDB();

    const goal = await goalRepo.findById(params.id, auth.user.userId);

    if (!goal) {
      return apiResponse.error('Goal not found', 404);
    }

    return apiResponse.success(goal, 'Goal retrieved successfully');
  } catch (error: any) {
    console.error('Error fetching goal:', error);
    return apiResponse.error(
      error.message || 'Failed to fetch goal',
      500
    );
  }
});

// PUT /api/goals/[id] - Update goal
export const PUT = withAuth(async (req: NextRequest, { auth, params }) => {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = updateGoalSchema.parse(body);

    const goal = await goalRepo.update(params.id, auth.user.userId, validatedData);

    return apiResponse.success(goal, 'Goal updated successfully');
  } catch (error: any) {
    console.error('Error updating goal:', error);
    
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid goal data', 400, error.errors);
    }
    
    if (error.message === 'Goal not found') {
      return apiResponse.error('Goal not found', 404);
    }
    
    return apiResponse.error(
      error.message || 'Failed to update goal',
      500
    );
  }
});

// DELETE /api/goals/[id] - Delete goal
export const DELETE = withAuth(async (req: NextRequest, { auth, params }) => {
  try {
    await connectDB();

    const deleted = await goalRepo.delete(params.id, auth.user.userId);

    if (!deleted) {
      return apiResponse.error('Goal not found', 404);
    }

    return apiResponse.success(null, 'Goal deleted successfully');
  } catch (error: any) {
    console.error('Error deleting goal:', error);
    return apiResponse.error(
      error.message || 'Failed to delete goal',
      500
    );
  }
});