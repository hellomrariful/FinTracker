import nodemailer from 'nodemailer';
import { IUser } from '@/lib/models/User';

const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@fintracker.com';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const createTransporter = () => {
  if (!SMTP_HOST || process.env.NODE_ENV === 'development') {
    return {
      sendMail: async (options: any) => {
        console.log('📧 Email would be sent:');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('Content:', options.html || options.text);
        return { messageId: 'dev-' + Date.now() };
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
  const verificationUrl = `${APP_URL}/auth/verify-email?token=${token}&email=${encodeURIComponent(user.email)}`;

  const mailOptions = {
    from: EMAIL_FROM,
    to: user.email,
    subject: 'Verify your FinTracker account',
    html: `<p>Hello ${user.firstName}, please verify your email by clicking <a href="${verificationUrl}">this link</a>.</p>`,
    text: `Verify your email: ${verificationUrl}`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

export async function sendWelcomeEmail(user: IUser) {
  const dashboardUrl = `${APP_URL}/dashboard`;
  const mailOptions = {
    from: EMAIL_FROM,
    to: user.email,
    subject: 'Welcome to FinTracker',
    html: `<p>Hello ${user.firstName}, your account is verified. Visit your dashboard: <a href="${dashboardUrl}">Dashboard</a></p>`,
    text: `Dashboard: ${dashboardUrl}`,
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
}

