import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import { apiResponse } from '@/lib/utils/apiResponse';
import { goalRepo } from '@/lib/repositories/goalRepo';
import { connectDB } from '@/lib/db';

// GET /api/goals/reminders - Get goals needing reminders
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    await connectDB();

    const goals = await goalRepo.getGoalsNeedingReminders(auth.user.userId);

    return apiResponse.success(
      { goals, count: goals.length },
      'Goals needing reminders retrieved successfully'
    );
  } catch (error: any) {
    console.error('Error fetching goals needing reminders:', error);
    return apiResponse.error(
      error.message || 'Failed to fetch goals needing reminders',
      500
    );
  }
});

// POST /api/goals/reminders/[id]/sent - Mark reminder as sent
export const POST = withAuth(async (req: NextRequest, { auth }) => {
  try {
    await connectDB();

    // Extract goal ID from the URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const goalIdIndex = pathParts.indexOf('reminders') + 1;
    
    if (goalIdIndex >= pathParts.length - 1) {
      return apiResponse.error('Goal ID is required', 400);
    }
    
    const goalId = pathParts[goalIdIndex];

    // Verify the goal belongs to the user
    const goal = await goalRepo.findById(goalId, auth.user.userId);
    if (!goal) {
      return apiResponse.error('Goal not found', 404);
    }

    await goalRepo.markReminderSent(goalId);

    return apiResponse.success(null, 'Reminder marked as sent');
  } catch (error: any) {
    console.error('Error marking reminder as sent:', error);
    return apiResponse.error(
      error.message || 'Failed to mark reminder as sent',
      500
    );
  }
});