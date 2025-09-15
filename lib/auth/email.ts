import nodemailer from "nodemailer";
import { IUser } from "@/lib/models/User";

const EMAIL_FROM = process.env.EMAIL_FROM || "info.fintracker@gmail.com";
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://fintracker.io";

const createTransporter = () => {
  if (!SMTP_HOST || process.env.NODE_ENV === "development") {
    return {
      sendMail: async (options: any) => {
        console.log("📧 Email would be sent:");
        console.log("To:", options.to);
        console.log("Subject:", options.subject);
        console.log("Content:", options.html || options.text);
        return { messageId: "dev-" + Date.now() };
      },
    } as any;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const transporter = createTransporter();

export async function sendVerificationEmail(user: IUser, token: string) {
  const verificationUrl = `${APP_URL}/auth/verify-email?email=${encodeURIComponent(
    user.email
  )}`;

  const mailOptions = {
    from: EMAIL_FROM,
    to: user.email,
    subject: "Verify your FinTracker account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to FinTracker!</h2>
        <p>Hello ${user.firstName},</p>
        <p>Thank you for creating an account with FinTracker. To complete your registration, please verify your email address.</p>
        
        <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #666;">Your verification code is:</p>
          <h1 style="color: #333; font-size: 32px; letter-spacing: 5px; margin: 10px 0;">${token}</h1>
        </div>
        
        <p>Enter this code on the verification page, or <a href="${verificationUrl}" style="color: #4CAF50;">click here</a> to verify your email.</p>
        
        <p style="color: #666; font-size: 14px;">This code will expire in 24 hours.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px;">If you didn't create an account with FinTracker, please ignore this email.</p>
      </div>
    `,
    text: `Hello ${user.firstName},\n\nYour FinTracker verification code is: ${token}\n\nThis code will expire in 24 hours.\n\nOr verify your email here: ${verificationUrl}`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

export async function sendWelcomeEmail(user: IUser) {
  const dashboardUrl = `${APP_URL}/dashboard`;
  const mailOptions = {
    from: EMAIL_FROM,
    to: user.email,
    subject: "Welcome to FinTracker",
    html: `<p>Hello ${user.firstName}, your account is verified. Visit your dashboard: <a href="${dashboardUrl}">Dashboard</a></p>`,
    text: `Dashboard: ${dashboardUrl}`,
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
}

export async function sendPasswordResetEmail(user: IUser, token: string) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(
    user.email
  )}`;

  const mailOptions = {
    from: EMAIL_FROM,
    to: user.email,
    subject: "Reset Your FinTracker Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${user.firstName},</p>
        <p>We received a request to reset your password for your FinTracker account.</p>
        
        <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;">Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="margin: 0; font-size: 12px; color: #666;">Or copy and paste this link into your browser:</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; word-break: break-all; color: #666;">${resetUrl}</p>
        </div>
        
        <p style="color: #666;">This link will expire in 1 hour for security reasons.</p>
        <p style="color: #666;">If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px;">This is an automated email from FinTracker. Please do not reply to this email.</p>
      </div>
    `,
    text: `Hello ${user.firstName},\n\nWe received a request to reset your password.\n\nReset your password here: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}
