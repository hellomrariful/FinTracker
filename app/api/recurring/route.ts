import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/middleware/auth';
import connectDB from '@/lib/db/mongodb';
import RecurringTransaction from '@/models/RecurringTransaction';
import Expense from '@/lib/models/Expense';
import Income from '@/lib/models/Income';
import { z } from 'zod';

// Validation schema
const recurringTransactionSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['expense', 'income']),
  amount: z.number().positive(),
  category: z.string().min(1),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly']),
  startDate: z.string().transform(val => new Date(val)),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  dayOfMonth: z.number().min(1).max(31).optional(),
  dayOfWeek: z.number().min(0).max(6).optional(),
  tags: z.array(z.string()).optional(),
  paymentMethod: z.string().optional(),
  vendor: z.string().optional(),
  customer: z.string().optional(),
  autoProcess: z.boolean().default(false),
  notifyBeforeDays: z.number().min(0).default(1),
});

// GET /api/recurring - List recurring transactions
export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateUser(req);
    if (!auth.authenticated) {
      return auth.response || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const isActive = searchParams.get('active');

    const query: any = { userId: auth.user!.userId };
    if (type) query.type = type;
    if (isActive !== null) query.isActive = isActive === 'true';

    const recurring = await RecurringTransaction.find(query)
      .sort({ nextDueDate: 1 });

    // Get upcoming transactions for next 30 days
    const upcoming = await (RecurringTransaction as any).getUpcoming(auth.user!.userId, 30);

    return NextResponse.json({
      recurring,
      upcoming,
      stats: {
        total: recurring.length,
        active: recurring.filter(r => r.isActive && !r.isPaused).length,
        paused: recurring.filter(r => r.isPaused).length,
        expense: recurring.filter(r => r.type === 'expense').length,
        income: recurring.filter(r => r.type === 'income').length,
      }
    });
  } catch (error) {
    console.error('List recurring transactions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recurring transactions' },
      { status: 500 }
    );
  }
}

// POST /api/recurring - Create recurring transaction
export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateUser(req);
    if (!auth.authenticated) {
      return auth.response || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = recurringTransactionSchema.parse(body);

    await connectDB();

    // Calculate first due date
    let nextDueDate = validatedData.startDate;
    if (validatedData.frequency === 'monthly' && validatedData.dayOfMonth) {
      nextDueDate.setDate(validatedData.dayOfMonth);
      if (nextDueDate < validatedData.startDate) {
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      }
    }

    const recurring = await RecurringTransaction.create({
      ...validatedData,
      userId: auth.user!.userId,
      nextDueDate,
      isActive: true,
      isPaused: false,
      executionHistory: [],
    });

    return NextResponse.json({
      success: true,
      recurring,
    });
  } catch (error) {
    console.error('Create recurring transaction error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create recurring transaction' },
      { status: 500 }
    );
  }
}

// PUT /api/recurring/[id] - Update recurring transaction
export async function PUT(req: NextRequest) {
  try {
    const auth = await authenticateUser(req);
    if (!auth.authenticated) {
      return auth.response || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const body = await req.json();

    await connectDB();

    const recurring = await RecurringTransaction.findOneAndUpdate(
      { _id: id, userId: auth.user!.userId },
      body,
      { new: true }
    );

    if (!recurring) {
      return NextResponse.json({ error: 'Recurring transaction not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      recurring,
    });
  } catch (error) {
    console.error('Update recurring transaction error:', error);
    return NextResponse.json(
      { error: 'Failed to update recurring transaction' },
      { status: 500 }
    );
  }
}

// DELETE /api/recurring/[id] - Delete recurring transaction
export async function DELETE(req: NextRequest) {
  try {
    const auth = await authenticateUser(req);
    if (!auth.authenticated) {
      return auth.response || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await connectDB();

    const recurring = await RecurringTransaction.findOneAndDelete({
      _id: id,
      userId: auth.user!.userId,
    });

    if (!recurring) {
      return NextResponse.json({ error: 'Recurring transaction not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Recurring transaction deleted successfully',
    });
  } catch (error) {
    console.error('Delete recurring transaction error:', error);
    return NextResponse.json(
      { error: 'Failed to delete recurring transaction' },
      { status: 500 }
    );
  }
}

// PATCH /api/recurring/[id]/pause - Pause/unpause recurring transaction
export async function PATCH(req: NextRequest) {
  try {
    const auth = await authenticateUser(req);
    if (!auth.authenticated) {
      return auth.response || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');

    if (!id || !action) {
      return NextResponse.json({ error: 'ID and action are required' }, { status: 400 });
    }

    await connectDB();

    let update = {};
    switch (action) {
      case 'pause':
        update = { isPaused: true };
        break;
      case 'resume':
        update = { isPaused: false };
        break;
      case 'process':
        // Manually process a due transaction
        const transaction = await RecurringTransaction.findOne({
          _id: id,
          userId: auth.user!.userId,
        });
        
        if (!transaction) {
          return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        const result = await (transaction as any).process();
        return NextResponse.json(result);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const recurring = await RecurringTransaction.findOneAndUpdate(
      { _id: id, userId: auth.user!.userId },
      update,
      { new: true }
    );

    if (!recurring) {
      return NextResponse.json({ error: 'Recurring transaction not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      recurring,
    });
  } catch (error) {
    console.error('Update recurring transaction error:', error);
    return NextResponse.json(
      { error: 'Failed to update recurring transaction' },
      { status: 500 }
    );
  }
}