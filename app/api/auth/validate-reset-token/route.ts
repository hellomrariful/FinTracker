import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';

// Validation schema
const validateTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = validateTokenSchema.parse(body);

    // Connect to database
    await connectDB();

    // Hash the token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(validatedData.token)
      .digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      email: validatedData.email.toLowerCase(),
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token', valid: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      message: 'Token is valid',
    });

  } catch (error) {
    console.error('Validate reset token error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', valid: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', valid: false },
      { status: 500 }
    );
  }
}