import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import { apiResponse } from '@/lib/utils/apiResponse';
import { goalRepo } from '@/lib/repositories/goalRepo';
import { goalFilterSchema, createGoalSchema } from '@/lib/validations/goal';
import { connectDB } from '@/lib/db';

// GET /api/goals - List goals with filters
export const GET = withAuth(async (req: NextRequest, { auth }) => {
  try {
    await connectDB();

    // Parse and validate query parameters
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const validatedFilters = goalFilterSchema.parse(searchParams);

    const {
      page = 1,
      limit = 20,
      sortBy = 'deadline',
      sortOrder = 'asc',
      ...filters
    } = validatedFilters;

    const result = await goalRepo.list(
      auth.user.userId,
      filters,
      page,
      limit,
      sortBy,
      sortOrder
    );

    return apiResponse.success(result, 'Goals retrieved successfully');
  } catch (error: any) {
    console.error('Error fetching goals:', error);
    
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid filter parameters', 400, error.errors);
    }
    
    return apiResponse.error(
      error.message || 'Failed to fetch goals',
      500
    );
  }
});

// POST /api/goals - Create new goal
export const POST = withAuth(async (req: NextRequest, { auth }) => {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = createGoalSchema.parse(body);

    const goal = await goalRepo.create(auth.user.userId, validatedData);

    return apiResponse.success(goal, 'Goal created successfully', 201);
  } catch (error: any) {
    console.error('Error creating goal:', error);
    
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid goal data', 400, error.errors);
    }
    
    return apiResponse.error(
      error.message || 'Failed to create goal',
      500
    );
  }
});