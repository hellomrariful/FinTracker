import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { sendVerificationEmail } from '@/lib/auth/email';
import crypto from 'crypto';

// Validation schema
const resendSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = resendSchema.parse(body);

    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({
      email: validatedData.email.toLowerCase(),
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Check rate limiting - don't allow resending within 1 minute
    if (user.emailVerificationExpires) {
      const lastSentTime = new Date(user.emailVerificationExpires).getTime() - (24 * 60 * 60 * 1000); // Subtract 24 hours to get when it was sent
      const now = new Date().getTime();
      const timeSinceLastSent = now - lastSentTime;
      
      if (timeSinceLastSent < 60000) { // Less than 1 minute
        const waitTime = Math.ceil((60000 - timeSinceLastSent) / 1000);
        return NextResponse.json(
          { error: `Please wait ${waitTime} seconds before requesting another code` },
          { status: 429 }
        );
      }
    }

    // Generate new verification token (6-digit code)
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store hashed token in database
    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    // Set expiration to 24 hours from now
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    // Send verification email with the plain token
    try {
      await sendVerificationEmail(user, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Verification code sent successfully',
      email: user.email,
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    
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