import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';

// Validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])/, 'Password must contain a lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain an uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain a number'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = resetPasswordSchema.parse(body);

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
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Update password (will be hashed by pre-save hook)
    user.password = validatedData.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    // Update lastPasswordChange for security tracking
    user.lastPasswordChange = new Date();
    
    await user.save();

    return NextResponse.json({
      message: 'Password reset successfully',
    });

  } catch (error) {
    console.error('Reset password error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}