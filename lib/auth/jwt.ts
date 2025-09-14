import jwt from 'jsonwebtoken';
import { IUser } from '@/lib/models/User';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';

export function generateTokens(user: IUser) {
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email, role: user.role, type: 'access' },
    JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

export function verifyToken(token: string, type: 'access' | 'refresh') {
  try {
    const secret = type === 'access' ? JWT_ACCESS_SECRET : JWT_REFRESH_SECRET;
    return jwt.verify(token, secret) as { userId: string; email?: string; role?: string };
  } catch (err) {
    return null;
  }
}

export function getTokenExpiry() {
  return {
    accessToken: 15 * 60 * 1000, // 15 minutes in ms
    refreshToken: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  };
}
