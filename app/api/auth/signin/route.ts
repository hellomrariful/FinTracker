import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import Session from "@/lib/models/Session";
import { generateTokens, getTokenExpiry } from "@/lib/auth/jwt";
import { cookies } from "next/headers";

// Validation schema
const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = signinSchema.parse(body);

    // Connect to database
    await connectDB();

    // Find user with password field
    const user = await User.findOne({
      email: validatedData.email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Your account has been deactivated. Please contact support." },
        { status: 403 }
      );
    }

    // Skip email verification for now (can be enabled later)
    // if (!user.isEmailVerified) {
    //   return NextResponse.json(
    //     {
    //       error: 'Please verify your email before signing in.',
    //       needsVerification: true,
    //       email: user.email
    //     },
    //     { status: 403 }
    //   );
    // }

    // Verify password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    user.metadata = {
      ...user.metadata,
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    };
    await user.save();

    // Invalidate old sessions for this user
    await Session.updateMany(
      { userId: user._id, isValid: true },
      { isValid: false }
    );

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);
    const { accessToken: accessTokenExpiry, refreshToken: refreshTokenExpiry } =
      getTokenExpiry();

    // Create new session
    const session = new Session({
      userId: user._id,
      refreshToken,
      userAgent: request.headers.get("user-agent"),
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip"),
      expiresAt: new Date(Date.now() + refreshTokenExpiry),
    });
    await session.save();

    // Set cookies
    const cookieStore = await cookies();

    // Access token cookie
    cookieStore.set("access-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: accessTokenExpiry / 1000,
      path: "/",
    });

    // Refresh token cookie
    cookieStore.set("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: refreshTokenExpiry / 1000,
      path: "/",
    });

    // Return user data (without sensitive info)
    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin,
      },
      message: "Signed in successfully",
    });
  } catch (error) {
    console.error("Signin error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
