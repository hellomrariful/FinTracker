import { config, isDevelopment, isProduction } from './config/env';

/**
 * Initialize the application
 * This runs once when the app starts
 */
export async function initializeApp() {
  console.log('🚀 Initializing Fintracker...');
  
  // Log environment
  console.log(`📍 Environment: ${config.app.env}`);
  console.log(`🌐 App URL: ${config.app.url}`);
  
  // Check required services
  if (!config.db.uri) {
    throw new Error('❌ MongoDB URI is not configured. Please check your environment variables.');
  }
  
  // Log available services
  console.log('\n📦 Available Services:');
  console.log(`  ✅ MongoDB: Connected`);
  
  if (config.redis.enabled) {
    console.log(`  ✅ Redis: ${config.redis.url}`);
  } else {
    console.log('  ⚠️  Redis: Not configured (caching disabled)');
  }
  
  if (config.email.enabled) {
    console.log(`  ✅ Email: ${config.email.smtp.host}:${config.email.smtp.port}`);
  } else {
    console.log('  ⚠️  Email: Not configured (using console output)');
  }
  
  if (config.storage.enabled) {
    console.log('  ✅ File Storage: Vercel Blob configured');
  } else {
    console.log('  ⚠️  File Storage: Not configured (uploads disabled)');
  }
  
  // Log feature flags
  console.log('\n🎛️  Feature Flags:');
  const features = [
    { name: 'Email Verification', key: 'ENABLE_EMAIL_VERIFICATION' },
    { name: 'Rate Limiting', key: 'ENABLE_RATE_LIMITING' },
    { name: 'File Uploads', key: 'ENABLE_FILE_UPLOADS' },
    { name: 'Export/Import', key: 'ENABLE_EXPORT_IMPORT' },
    { name: 'Notifications', key: 'ENABLE_NOTIFICATIONS' },
    { name: 'Recurring Transactions', key: 'ENABLE_RECURRING_TRANSACTIONS' },
  ];
  
  features.forEach(({ name, key }) => {
    const enabled = process.env[key] === 'true';
    console.log(`  ${enabled ? '✅' : '⭕'} ${name}: ${enabled ? 'Enabled' : 'Disabled'}`);
  });
  
  // Development warnings
  if (isDevelopment) {
    console.log('\n⚠️  Development Mode:');
    
    if (!config.auth.jwtAccessSecret || config.auth.jwtAccessSecret.length < 32) {
      console.warn('  ⚠️  JWT access secret is too short. Use at least 32 characters in production.');
    }
    
    if (!config.auth.jwtRefreshSecret || config.auth.jwtRefreshSecret.length < 32) {
      console.warn('  ⚠️  JWT refresh secret is too short. Use at least 32 characters in production.');
    }
    
    if (config.dev.seedDatabase) {
      console.log('  🌱 Database seeding is enabled');
    }
    
    if (config.dev.debug) {
      console.log('  🐛 Debug mode is enabled');
    }
  }
  
  // Production checks
  if (isProduction) {
    const criticalMissing = [];
    
    if (!config.redis.enabled) {
      criticalMissing.push('Redis (for caching and rate limiting)');
    }
    
    if (!config.email.enabled) {
      criticalMissing.push('Email service (for notifications)');
    }
    
    if (!config.storage.enabled) {
      criticalMissing.push('File storage (for attachments)');
    }
    
    if (criticalMissing.length > 0) {
      console.warn('\n⚠️  Production Warning - Missing services:');
      criticalMissing.forEach(service => {
        console.warn(`  - ${service}`);
      });
    }
  }
  
  console.log('\n✅ Fintracker initialized successfully!\n');
  console.log('━'.repeat(50));
  
  return {
    environment: config.app.env,
    services: {
      mongodb: true,
      redis: config.redis.enabled,
      email: config.email.enabled,
      storage: config.storage.enabled,
    },
    features: {
      emailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
      rateLimiting: process.env.ENABLE_RATE_LIMITING === 'true',
      fileUploads: process.env.ENABLE_FILE_UPLOADS === 'true',
      exportImport: process.env.ENABLE_EXPORT_IMPORT === 'true',
      notifications: process.env.ENABLE_NOTIFICATIONS === 'true',
      recurringTransactions: process.env.ENABLE_RECURRING_TRANSACTIONS === 'true',
    },
  };
}

// Run initialization if this is the main module
if (require.main === module) {
  initializeApp().catch(error => {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  });
}