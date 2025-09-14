import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import { connectDB } from '@/lib/db/mongoose';
import Employee from '@/lib/models/Employee';

// GET all employees
export const GET = withAuth(async (request: NextRequest, { auth }) => {
  try {
    await connectDB();

    const employees = await Employee.find({ userId: auth.user.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ 
      success: true, 
      data: employees 
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
});

// POST new employee
export const POST = withAuth(async (request: NextRequest, { auth }) => {
  try {
    await connectDB();
    const body = await request.json();

    const employee = await Employee.create({
      ...body,
      userId: auth.user.userId
    });

    return NextResponse.json({
      success: true,
      data: employee
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
});
