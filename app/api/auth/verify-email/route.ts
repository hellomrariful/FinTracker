import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { sendWelcomeEmail } from '@/lib/auth/email';

// Validation schema
const verifySchema = z.object({
  email: z.string().email('Invalid email address'),
  token: z.string().length(6, 'Verification code must be 6 digits').regex(/^\d{6}$/, 'Verification code must be 6 digits'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = verifySchema.parse(body);

    // Connect to database
    await connectDB();

    // Hash the token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(validatedData.token)
      .digest('hex');

    // Find user with verification token
    const user = await User.findOne({
      email: validatedData.email.toLowerCase(),
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return NextResponse.json({
        message: 'Email already verified',
        verified: true,
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue - not critical
    }

    return NextResponse.json({
      message: 'Email verified successfully',
      verified: true,
    });

  } catch (error) {
    console.error('Email verification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method for clicking verification links
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      return NextResponse.redirect(
        new URL('/auth/verify-email?error=missing-params', request.url)
      );
    }

    // Connect to database
    await connectDB();

    // Hash the token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with verification token
    const user = await User.findOne({
      email: email.toLowerCase(),
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      return NextResponse.redirect(
        new URL('/auth/verify-email?error=invalid-token', request.url)
      );
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return NextResponse.redirect(
        new URL('/auth/signin?message=already-verified', request.url)
      );
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    // Redirect to signin with success message
    return NextResponse.redirect(
      new URL('/auth/signin?message=email-verified', request.url)
    );

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(
      new URL('/auth/verify-email?error=server-error', request.url)
    );
  }
}
