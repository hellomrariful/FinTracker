import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { sendPasswordResetEmail } from '@/lib/auth/email';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);

    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({
      email: validatedData.email.toLowerCase(),
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    }

    // Check if user has requested reset recently (within 5 minutes)
    if (user.passwordResetExpires) {
      const lastRequestTime = new Date(user.passwordResetExpires).getTime() - (60 * 60 * 1000); // Subtract 1 hour to get request time
      const now = new Date().getTime();
      const timeSinceLastRequest = now - lastRequestTime;
      
      if (timeSinceLastRequest < 5 * 60 * 1000) { // Less than 5 minutes
        return NextResponse.json({
          message: 'Password reset email recently sent. Please check your email or try again later.',
        });
      }
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token for storage
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Save hashed token and expiry
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send reset email with plain token
    try {
      await sendPasswordResetEmail(user, resetToken);
      console.log('Password reset email sent to:', user.email);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Don't expose email errors to user
    }

    return NextResponse.json({
      message: 'If an account exists with this email, you will receive a password reset link.',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}