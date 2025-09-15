import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import { apiResponse } from '@/lib/utils/apiResponse';
import { goalRepo } from '@/lib/repositories/goalRepo';
import { updateMilestoneSchema } from '@/lib/validations/goal';
import { connectDB } from '@/lib/db';

// PUT /api/goals/[id]/milestones/[index] - Update milestone
export const PUT = withAuth(async (req: NextRequest, { auth, params }) => {
  try {
    await connectDB();

    const milestoneIndex = parseInt(params.index);
    if (isNaN(milestoneIndex)) {
      return apiResponse.error('Invalid milestone index', 400);
    }

    const body = await req.json();
    const validatedData = updateMilestoneSchema.parse(body);

    const goal = await goalRepo.updateMilestone(params.id, auth.user.userId, milestoneIndex, validatedData);

    return apiResponse.success(goal, 'Milestone updated successfully');
  } catch (error: any) {
    console.error('Error updating milestone:', error);
    
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid milestone data', 400, error.errors);
    }
    
    if (error.message === 'Goal not found') {
      return apiResponse.error('Goal not found', 404);
    }
    
    if (error.message === 'Invalid milestone index') {
      return apiResponse.error('Invalid milestone index', 400);
    }
    
    return apiResponse.error(
      error.message || 'Failed to update milestone',
      500
    );
  }
});

// DELETE /api/goals/[id]/milestones/[index] - Delete milestone
export const DELETE = withAuth(async (req: NextRequest, { auth, params }) => {
  try {
    await connectDB();

    const milestoneIndex = parseInt(params.index);
    if (isNaN(milestoneIndex)) {
      return apiResponse.error('Invalid milestone index', 400);
    }

    const goal = await goalRepo.deleteMilestone(params.id, auth.user.userId, milestoneIndex);

    return apiResponse.success(goal, 'Milestone deleted successfully');
  } catch (error: any) {
    console.error('Error deleting milestone:', error);
    
    if (error.message === 'Goal not found') {
      return apiResponse.error('Goal not found', 404);
    }
    
    if (error.message === 'Invalid milestone index') {
      return apiResponse.error('Invalid milestone index', 400);
    }
    
    return apiResponse.error(
      error.message || 'Failed to delete milestone',
      500
    );
  }
});