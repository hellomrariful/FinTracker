import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db/mongodb';
import Expense from '@/lib/models/Expense';
import { authenticateUser, ownsResource } from '@/lib/middleware/auth';
import mongoose from 'mongoose';

// Update expense schema
const updateExpenseSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  category: z.string().min(1).optional(),
  vendor: z.string().optional(),
  platform: z.string().optional(),
  amount: z.number().positive().optional(),
  date: z.string().transform(str => new Date(str)).optional(),
  paymentMethod: z.enum(['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash', 'Check', 'PayPal', 'Company Card', 'Other']).optional(),
  employeeId: z.string().optional().nullable(),
  status: z.enum(['completed', 'pending', 'cancelled', 'reimbursement_pending']).optional(),
  receipt: z.string().optional(),
  businessPurpose: z.string().max(500).optional(),
  projectId: z.string().optional(),
  isReimbursable: z.boolean().optional(),
  reimbursementStatus: z.enum(['pending', 'approved', 'rejected', 'paid']).optional(),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  taxDeductible: z.boolean().optional(),
});

// GET /api/expenses/[id] - Get single expense
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticateUser(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid expense ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const expense = await Expense.findOne({
      _id: id,
      userId: authResult.user!.userId,
    })
      .populate('employeeId', 'name email')
      .populate('approvedBy', 'firstName lastName email');

    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ expense });
  } catch (error) {
    console.error('Error fetching expense:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/expenses/[id] - Update expense
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticateUser(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid expense ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    let validatedData;
    try {
      validatedData = updateExpenseSchema.parse(body);
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

    const isOwner = await ownsResource(authResult.user!.userId, id, Expense);
    if (!isOwner) {
      return NextResponse.json(
        { error: 'Expense not found or access denied' },
        { status: 404 }
      );
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        ...validatedData,
        updatedAt: new Date(),
      },
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

    return NextResponse.json({
      message: 'Expense updated successfully',
      expense: updatedExpense,
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/expenses/[id] - Delete expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticateUser(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid expense ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const isOwner = await ownsResource(authResult.user!.userId, id, Expense);
    if (!isOwner) {
      return NextResponse.json(
        { error: 'Expense not found or access denied' },
        { status: 404 }
      );
    }

    const result = await Expense.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to delete expense' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
