import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db/mongodb';
import Expense from '@/lib/models/Expense';
import { authenticateUser, hasRole } from '@/lib/middleware/auth';
import mongoose from 'mongoose';

// Approval schema
const approvalSchema = z.object({
  action: z.enum(['approve', 'reject', 'pay']),
  comments: z.string().optional(),
});

// POST /api/expenses/[id]/approve - Approve/reject expense reimbursement
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateUser(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    // Check if user has permission to approve expenses
    // Only admin and manager roles can approve
    if (!hasRole(authResult.user!.role, ['admin', 'manager', 'owner'])) {
      return NextResponse.json(
        { error: 'You do not have permission to approve expenses' },
        { status: 403 }
      );
    }

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid expense ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    let validatedData;
    try {
      validatedData = approvalSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

    await connectDB();

    // Find the expense
    const expense = await Expense.findOne({
      _id: id,
      userId: authResult.user!.userId,
      isReimbursable: true,
    });

    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found or not reimbursable' },
        { status: 404 }
      );
    }

    // Check current status
    if (!expense.isReimbursable) {
      return NextResponse.json(
        { error: 'This expense is not marked as reimbursable' },
        { status: 400 }
      );
    }

    // Update based on action
    let updateData: any = {
      approvedBy: authResult.user!.userId,
      approvalDate: new Date(),
    };

    switch (validatedData.action) {
      case 'approve':
        if (expense.reimbursementStatus === 'paid') {
          return NextResponse.json(
            { error: 'This expense has already been paid' },
            { status: 400 }
          );
        }
        updateData.reimbursementStatus = 'approved';
        updateData.status = 'reimbursement_pending';
        break;
      
      case 'reject':
        if (expense.reimbursementStatus === 'paid') {
          return NextResponse.json(
            { error: 'Cannot reject an already paid expense' },
            { status: 400 }
          );
        }
        updateData.reimbursementStatus = 'rejected';
        updateData.status = 'completed'; // Move back to completed
        break;
      
      case 'pay':
        if (expense.reimbursementStatus !== 'approved') {
          return NextResponse.json(
            { error: 'Expense must be approved before payment' },
            { status: 400 }
          );
        }
        updateData.reimbursementStatus = 'paid';
        updateData.status = 'completed';
        break;
    }

    // Update the expense
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('employeeId', 'name email')
      .populate('approvedBy', 'firstName lastName email');

    if (!updatedExpense) {
      return NextResponse.json(
        { error: 'Failed to update expense' },
        { status: 500 }
      );
    }

    // TODO: Send notification email to employee about the approval/rejection

    return NextResponse.json({
      message: `Expense ${validatedData.action}d successfully`,
      expense: updatedExpense,
    });
  } catch (error) {
    console.error('Error processing expense approval:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/expenses/[id]/approve - Get pending reimbursements for approval
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateUser(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    // Check if user has permission to view pending approvals
    if (!hasRole(authResult.user!.role, ['admin', 'manager', 'owner'])) {
      return NextResponse.json(
        { error: 'You do not have permission to view pending approvals' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || 'pending';

    await connectDB();

    const query: any = {
      userId: authResult.user!.userId,
      isReimbursable: true,
    };

    // Filter by reimbursement status
    if (status === 'all') {
      // Show all reimbursable expenses
    } else {
      query.reimbursementStatus = status;
    }

    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      Expense.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate('employeeId', 'name email department')
        .populate('approvedBy', 'firstName lastName email')
        .lean(),
      Expense.countDocuments(query),
    ]);

    // Get statistics
    const stats = await Expense.aggregate([
      { $match: { userId: authResult.user!.userId, isReimbursable: true } },
      {
        $group: {
          _id: '$reimbursementStatus',
          count: { $sum: 1 },
          total: { $sum: '$amount' },
        },
      },
    ]);

    const formattedStats = {
      pending: { count: 0, total: 0 },
      approved: { count: 0, total: 0 },
      rejected: { count: 0, total: 0 },
      paid: { count: 0, total: 0 },
    };

    stats.forEach(stat => {
      if (stat._id && formattedStats[stat._id as keyof typeof formattedStats]) {
        formattedStats[stat._id as keyof typeof formattedStats] = {
          count: stat.count,
          total: stat.total,
        };
      }
    });

    return NextResponse.json({
      expenses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
      stats: formattedStats,
    });
  } catch (error) {
    console.error('Error fetching pending reimbursements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
