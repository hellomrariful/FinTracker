import { z } from 'zod';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env files
if (typeof window === 'undefined') {
  // Server-side only
  const envFiles = ['.env.local', '.env'];
  
  for (const file of envFiles) {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      dotenv.config({ path: filePath });
    }
  }
}

/**
 * Environment variable validation schema
 */
const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  
  // Database
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),
  
  // Authentication
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT access secret must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT refresh secret must be at least 32 characters'),
  SESSION_COOKIE_NAME: z.string().default('fintracker-session'),
  SESSION_MAX_AGE: z.string().transform(Number).default('2592000'),
  
  // Redis (optional in development)
  REDIS_URL: z.string().optional(),
  
  // File Storage (optional in development)
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  
  // Email Configuration
  EMAIL_FROM: z.string().email().default('noreply@fintracker.com'),
  EMAIL_REPLY_TO: z.string().email().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_SECURE: z.string().transform(val => val === 'true').optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('60000'),
  RATE_LIMIT_MAX: z.string().transform(Number).default('60'),
  RATE_LIMIT_AUTH_WINDOW: z.string().transform(Number).default('900000'),
  RATE_LIMIT_AUTH_MAX: z.string().transform(Number).default('5'),
  
  // Security
  CORS_ALLOWED_ORIGINS: z.string().optional(),
  CSP_REPORT_URI: z.string().optional(),
  
  // Monitoring (optional)
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
  OTEL_SERVICE_NAME: z.string().default('fintracker'),
  SENTRY_DSN: z.string().optional(),
  
  // Feature Flags
  ENABLE_EMAIL_VERIFICATION: z.string().transform(val => val === 'true').default('true'),
  ENABLE_RATE_LIMITING: z.string().transform(val => val === 'true').default('true'),
  ENABLE_FILE_UPLOADS: z.string().transform(val => val === 'true').default('true'),
  ENABLE_EXPORT_IMPORT: z.string().transform(val => val === 'true').default('true'),
  ENABLE_NOTIFICATIONS: z.string().transform(val => val === 'true').default('true'),
  ENABLE_RECURRING_TRANSACTIONS: z.string().transform(val => val === 'true').default('true'),
  
  // Development
  SEED_DATABASE: z.string().transform(val => val === 'true').default('false'),
  DEBUG: z.string().transform(val => val === 'true').default('false'),
});

/**
 * Parse and validate environment variables
 */
function validateEnv() {
  const parsed = envSchema.safeParse(process.env);
  
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
    
    // In production, throw error to prevent startup
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment variables');
    }
    
    // In development, show warning but continue
    console.warn('⚠️  Running with invalid environment configuration');
    console.warn('Please check .env.example for required variables');
  }
  
  return parsed.data || {} as z.infer<typeof envSchema>;
}

/**
 * Validated environment configuration
 */
export const env = validateEnv();

/**
 * Helper to check if app is in production
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Helper to check if app is in development
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Helper to check if app is in test mode
 */
export const isTest = env.NODE_ENV === 'test';

/**
 * Feature flags
 */
export const features = {
  emailVerification: env.ENABLE_EMAIL_VERIFICATION,
  rateLimiting: env.ENABLE_RATE_LIMITING,
  fileUploads: env.ENABLE_FILE_UPLOADS,
  exportImport: env.ENABLE_EXPORT_IMPORT,
  notifications: env.ENABLE_NOTIFICATIONS,
  recurringTransactions: env.ENABLE_RECURRING_TRANSACTIONS,
};

/**
 * Get required environment variables for specific services
 */
export const config = {
  app: {
    url: env.NEXT_PUBLIC_APP_URL,
    env: env.NODE_ENV,
  },
  
  db: {
    uri: env.MONGODB_URI,
  },
  
  auth: {
    jwtAccessSecret: env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: env.JWT_REFRESH_SECRET,
    sessionCookieName: env.SESSION_COOKIE_NAME,
    sessionMaxAge: env.SESSION_MAX_AGE,
  },
  
  redis: {
    url: env.REDIS_URL,
    enabled: !!env.REDIS_URL,
  },
  
  storage: {
    blobToken: env.BLOB_READ_WRITE_TOKEN,
    enabled: !!env.BLOB_READ_WRITE_TOKEN,
  },
  
  email: {
    from: env.EMAIL_FROM,
    replyTo: env.EMAIL_REPLY_TO || env.EMAIL_FROM,
    smtp: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: env.SMTP_USER && env.SMTP_PASS ? {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      } : undefined,
    },
    enabled: !!env.SMTP_HOST,
  },
  
  rateLimit: {
    window: env.RATE_LIMIT_WINDOW,
    max: env.RATE_LIMIT_MAX,
    authWindow: env.RATE_LIMIT_AUTH_WINDOW,
    authMax: env.RATE_LIMIT_AUTH_MAX,
  },
  
  security: {
    corsOrigins: env.CORS_ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [],
    cspReportUri: env.CSP_REPORT_URI,
  },
  
  monitoring: {
    otel: {
      endpoint: env.OTEL_EXPORTER_OTLP_ENDPOINT,
      serviceName: env.OTEL_SERVICE_NAME,
      enabled: !!env.OTEL_EXPORTER_OTLP_ENDPOINT,
    },
    sentry: {
      dsn: env.SENTRY_DSN,
      enabled: !!env.SENTRY_DSN,
    },
  },
  
  dev: {
    seedDatabase: env.SEED_DATABASE,
    debug: env.DEBUG,
  },
};

export type Env = z.infer<typeof envSchema>;
export type Config = typeof config;