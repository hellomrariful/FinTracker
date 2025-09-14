import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import { apiResponse } from '@/lib/utils/apiResponse';
import { goalRepo } from '@/lib/repositories/goalRepo';
import { bulkDeleteSchema } from '@/lib/validations/goal';
import { connectDB } from '@/lib/db';

// DELETE /api/goals/bulk - Bulk delete goals
export const DELETE = withAuth(async (req: NextRequest, { auth }) => {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = bulkDeleteSchema.parse(body);

    const deletedCount = await goalRepo.bulkDelete(validatedData.goalIds, auth.user.userId);

    return apiResponse.success(
      { deletedCount },
      `${deletedCount} goal(s) deleted successfully`
    );
  } catch (error: any) {
    console.error('Error bulk deleting goals:', error);
    
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid request data', 400, error.errors);
    }
    
    return apiResponse.error(
      error.message || 'Failed to delete goals',
      500
    );
  }
});