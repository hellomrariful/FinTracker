import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import { apiResponse } from '@/lib/utils/apiResponse';
import { goalRepo } from '@/lib/repositories/goalRepo';
import { addMilestoneSchema } from '@/lib/validations/goal';
import { connectDB } from '@/lib/db';

// POST /api/goals/[id]/milestones - Add milestone to goal
export const POST = withAuth(async (req: NextRequest, { auth, params }) => {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = addMilestoneSchema.parse(body);

    const goal = await goalRepo.addMilestone(params.id, auth.user.userId, validatedData);

    return apiResponse.success(goal, 'Milestone added successfully');
  } catch (error: any) {
    console.error('Error adding milestone:', error);
    
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid milestone data', 400, error.errors);
    }
    
    if (error.message === 'Goal not found') {
      return apiResponse.error('Goal not found', 404);
    }
    
    return apiResponse.error(
      error.message || 'Failed to add milestone',
      500
    );
  }
});