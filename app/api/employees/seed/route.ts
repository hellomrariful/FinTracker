import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/protected-route';
import { connectDB } from '@/lib/db/mongoose';
import Employee from '@/lib/models/Employee';

// POST /api/employees/seed - Create sample employees
export const POST = withAuth(async (request: NextRequest, { auth }) => {
  try {
    await connectDB();

    // Check if employees already exist for this user
    const existingEmployees = await Employee.find({ userId: auth.user.userId });
    
    if (existingEmployees.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Employees already exist for this user',
        count: existingEmployees.length
      });
    }

    // Create sample employees
    const sampleEmployees = [
      {
        userId: auth.user.userId,
        name: 'John Doe',
        email: 'john.doe@company.com',
        role: 'Software Engineer',
        department: 'Engineering',
        status: 'active',
        hireDate: new Date('2023-01-15'),
        salary: 75000,
        salaryFrequency: 'yearly',
        performance: 85,
      },
      {
        userId: auth.user.userId,
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        role: 'Product Manager',
        department: 'Product',
        status: 'active',
        hireDate: new Date('2022-06-01'),
        salary: 95000,
        salaryFrequency: 'yearly',
        performance: 90,
      },
      {
        userId: auth.user.userId,
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        role: 'Sales Representative',
        department: 'Sales',
        status: 'active',
        hireDate: new Date('2023-03-20'),
        salary: 65000,
        salaryFrequency: 'yearly',
        performance: 80,
      },
      {
        userId: auth.user.userId,
        name: 'Sarah Williams',
        email: 'sarah.williams@company.com',
        role: 'Marketing Manager',
        department: 'Marketing',
        status: 'active',
        hireDate: new Date('2022-09-10'),
        salary: 80000,
        salaryFrequency: 'yearly',
        performance: 88,
      },
    ];

    const createdEmployees = await Employee.insertMany(sampleEmployees);

    return NextResponse.json({
      success: true,
      message: `Created ${createdEmployees.length} sample employees`,
      data: createdEmployees
    });

  } catch (error) {
    console.error('Error seeding employees:', error);
    return NextResponse.json(
      { error: 'Failed to seed employees' },
      { status: 500 }
    );
  }
});