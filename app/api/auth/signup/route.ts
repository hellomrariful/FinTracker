import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { sendVerificationEmail } from '@/lib/auth/email';

// Validation schema
const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: validatedData.email.toLowerCase() 
    });

    if (existingUser) {
      if (!existingUser.isEmailVerified) {
        // User exists but not verified, resend verification email
        const token = existingUser.generateEmailVerificationToken();
        await existingUser.save();
        
        try {
          await sendVerificationEmail(existingUser, token);
          return NextResponse.json({
            message: 'An account with this email already exists. We have resent the verification email.',
            requiresVerification: true,
            email: existingUser.email,
          });
        } catch (emailError) {
          console.error('Failed to resend verification email:', emailError);
          return NextResponse.json(
            { error: 'Failed to resend verification email. Please try again.' },
            { status: 500 }
          );
        }
      }
      
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = new User({
      email: validatedData.email.toLowerCase(),
      password: validatedData.password,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      company: validatedData.company,
      role: 'member', // Default role for new users
      isEmailVerified: false,
      isActive: true,
    });

    // Generate email verification token
    const verificationToken = newUser.generateEmailVerificationToken();
    
    // Save the user
    await newUser.save();

    // Send verification email
    try {
      await sendVerificationEmail(newUser, verificationToken);
      console.log('Verification email sent to:', newUser.email);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the signup if email fails, user can request resend
    }

    // Return success response
    return NextResponse.json({
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        company: newUser.company,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
      },
      message: 'Account created successfully! Please check your email to verify your account.',
      requiresVerification: true,
    });

  } catch (error) {
    console.error('Signup error:', error);
    
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
