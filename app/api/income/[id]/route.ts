import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db/mongodb';
import Income from '@/lib/models/Income';
import { authenticateUser, ownsResource } from '@/lib/middleware/auth';
import mongoose from 'mongoose';

// Update income schema
const updateIncomeSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  source: z.string().min(1).max(200).optional(),
  category: z.string().min(1).optional(),
  platform: z.string().optional(),
  amount: z.number().positive().optional(),
  date: z.string().transform(str => new Date(str)).optional(),
  paymentMethod: z.enum(['Bank Transfer', 'PayPal', 'Credit Card', 'Stripe', 'Check', 'Cash', 'Cryptocurrency', 'Other']).optional(),
  employeeId: z.string().optional().nullable(),
  status: z.enum(['completed', 'pending', 'cancelled']).optional(),
  recurring: z.boolean().optional(),
  recurringFrequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).optional().nullable(),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
});

// GET /api/income/[id] - Get single income transaction
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const authResult = await authenticateUser(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const { id } = params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find transaction
    const transaction = await Income.findOne({
      _id: id,
      userId: authResult.user!.userId,
    }).populate('employeeId', 'name email');

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error('Error fetching income transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/income/[id] - Update income transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const authResult = await authenticateUser(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const { id } = params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    
    let validatedData;
    try {
      validatedData = updateIncomeSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: error.errors },
          { status: 400 }
        );
      }
      throw error;
    }

    // Connect to database
    await connectDB();

    // Check ownership
    const isOwner = await ownsResource(authResult.user!.userId, id, Income);
    if (!isOwner) {
      return NextResponse.json(
        { error: 'Transaction not found or access denied' },
        { status: 404 }
      );
    }

    // Update transaction
    const updatedTransaction = await Income.findByIdAndUpdate(
      id,
      {
        ...validatedData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).populate('employeeId', 'name email');

    if (!updatedTransaction) {
      return NextResponse.json(
        { error: 'Failed to update transaction' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Income transaction updated successfully',
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error('Error updating income transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/income/[id] - Delete income transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const authResult = await authenticateUser(request);
    if (!authResult.authenticated) {
      return authResult.response;
    }

    const { id } = params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid transaction ID' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check ownership
    const isOwner = await ownsResource(authResult.user!.userId, id, Income);
    if (!isOwner) {
      return NextResponse.json(
        { error: 'Transaction not found or access denied' },
        { status: 404 }
      );
    }

    // Delete transaction
    const result = await Income.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to delete transaction' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Income transaction deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting income transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
