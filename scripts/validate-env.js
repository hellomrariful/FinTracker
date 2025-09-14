#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Load .env.local and .env files
if (fs.existsSync(path.join(process.cwd(), '.env.local'))) {
  require('dotenv').config({ path: '.env.local' });
}
if (fs.existsSync(path.join(process.cwd(), '.env'))) {
  require('dotenv').config({ path: '.env' });
}

const requiredEnvVars = [
  { name: 'MONGODB_URI', description: 'MongoDB connection string', validator: (v) => v && v.length > 0 },
  { name: 'JWT_ACCESS_SECRET', description: 'JWT access token secret (min 32 chars)', validator: (v) => v && v.length >= 32 },
  { name: 'JWT_REFRESH_SECRET', description: 'JWT refresh token secret (min 32 chars)', validator: (v) => v && v.length >= 32 },
];

const optionalEnvVars = [
  { name: 'REDIS_URL', description: 'Redis connection URL for caching & rate limiting' },
  { name: 'BLOB_READ_WRITE_TOKEN', description: 'Vercel Blob storage token for file uploads' },
  { name: 'SMTP_HOST', description: 'SMTP server host for sending emails' },
  { name: 'SMTP_PORT', description: 'SMTP server port' },
  { name: 'SMTP_USER', description: 'SMTP username' },
  { name: 'SMTP_PASS', description: 'SMTP password' },
  { name: 'EMAIL_FROM', description: 'Default sender email address' },
  { name: 'NEXT_PUBLIC_APP_URL', description: 'Public application URL' },
  { name: 'RATE_LIMIT_WINDOW', description: 'Rate limit time window (ms)' },
  { name: 'RATE_LIMIT_MAX', description: 'Max requests per window' },
];

const featureFlags = [
  { name: 'ENABLE_EMAIL_VERIFICATION', description: 'Email verification for new users' },
  { name: 'ENABLE_RATE_LIMITING', description: 'API rate limiting' },
  { name: 'ENABLE_FILE_UPLOADS', description: 'File upload functionality' },
  { name: 'ENABLE_EXPORT_IMPORT', description: 'Data export/import features' },
  { name: 'ENABLE_NOTIFICATIONS', description: 'In-app notifications' },
  { name: 'ENABLE_RECURRING_TRANSACTIONS', description: 'Recurring transactions' },
];

console.log('\n╔════════════════════════════════════════════════╗');
console.log('║     FINTRACKER ENVIRONMENT VALIDATION         ║');
console.log('╚════════════════════════════════════════════════╝\n');

let hasErrors = false;
let hasWarnings = false;

// Check required variables
console.log('📋 REQUIRED ENVIRONMENT VARIABLES');
console.log('━'.repeat(50));

requiredEnvVars.forEach(({ name, description, validator }) => {
  const value = process.env[name];
  
  if (!value) {
    console.error(`\n❌ ${name} - MISSING`);
    console.error(`   └─ ${description}`);
    hasErrors = true;
  } else if (validator && !validator(value)) {
    console.error(`\n⚠️  ${name} - INVALID`);
    console.error(`   └─ ${description}`);
    
    if (name.includes('JWT')) {
      console.error(`   └─ Current length: ${value.length} characters`);
    }
    hasErrors = true;
  } else {
    console.log(`\n✅ ${name} - CONFIGURED`);
    
    // Show connection info for MongoDB
    if (name === 'MONGODB_URI') {
      if (value.includes('mongodb+srv://')) {
        console.log('   └─ Type: MongoDB Atlas (Cloud)');
      } else if (value.includes('localhost') || value.includes('127.0.0.1')) {
        console.log('   └─ Type: Local MongoDB');
      } else {
        console.log('   └─ Type: Remote MongoDB');
      }
      
      const dbName = value.split('/').pop()?.split('?')[0];
      if (dbName) {
        console.log(`   └─ Database: ${dbName}`);
      }
    }
    
    // Mask sensitive values
    if (name.includes('SECRET') || name.includes('PASS')) {
      console.log(`   └─ Value: ${value.substring(0, 10)}...`);
    }
  }
});

// Check optional variables
console.log('\n\n📦 OPTIONAL ENVIRONMENT VARIABLES');
console.log('━'.repeat(50));

optionalEnvVars.forEach(({ name, description }) => {
  const value = process.env[name];
  
  if (!value) {
    console.warn(`\n⚠️  ${name} - NOT SET`);
    console.warn(`   └─ ${description}`);
    hasWarnings = true;
  } else {
    console.log(`\n✅ ${name} - CONFIGURED`);
    
    // Don't show sensitive values
    if (!name.includes('PASS') && !name.includes('TOKEN')) {
      console.log(`   └─ Value: ${value}`);
    }
  }
});

// Check feature flags
console.log('\n\n🚀 FEATURE FLAGS');
console.log('━'.repeat(50));

featureFlags.forEach(({ name, description }) => {
  const value = process.env[name];
  const isEnabled = value === 'true';
  
  if (isEnabled) {
    console.log(`\n✅ ${name} - ENABLED`);
  } else {
    console.log(`\n⭕ ${name} - DISABLED`);
  }
  console.log(`   └─ ${description}`);
});

// Check service availability based on env vars
console.log('\n\n🔌 SERVICE AVAILABILITY');
console.log('━'.repeat(50));

const services = [
  {
    name: 'MongoDB Database',
    enabled: !!process.env.MONGODB_URI,
    required: true,
  },
  {
    name: 'Redis Cache',
    enabled: !!process.env.REDIS_URL,
    required: false,
  },
  {
    name: 'Email Service (SMTP)',
    enabled: !!process.env.SMTP_HOST,
    required: false,
  },
  {
    name: 'File Storage (Vercel Blob)',
    enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
    required: false,
  },
  {
    name: 'Rate Limiting',
    enabled: process.env.ENABLE_RATE_LIMITING === 'true' && !!process.env.REDIS_URL,
    required: false,
  },
];

services.forEach(({ name, enabled, required }) => {
  if (enabled) {
    console.log(`\n✅ ${name} - AVAILABLE`);
  } else {
    const icon = required ? '❌' : '⭕';
    console.log(`\n${icon} ${name} - ${required ? 'MISSING (REQUIRED)' : 'NOT CONFIGURED'}`);
    if (required) hasErrors = true;
  }
});

// Show summary and recommendations
console.log('\n\n' + '═'.repeat(50));
console.log('📊 VALIDATION SUMMARY');
console.log('═'.repeat(50));

if (hasErrors) {
  console.error('\n❌ Environment validation FAILED');
  console.error('\n🔧 To fix missing required variables:');
  console.error('   1. Copy .env.example to .env.local');
  console.error('   2. Fill in all required values');
  console.error('   3. Generate secure secrets with:');
  console.error('      openssl rand -base64 32');
  console.error('\n📚 For Vercel deployment:');
  console.error('   Add these variables in Project Settings → Environment Variables');
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n✅ All required variables are configured');
  console.warn('⚠️  Some optional features are disabled due to missing configuration');
  console.log('\n💡 To enable all features, configure the optional variables listed above');
} else {
  console.log('\n✅ Environment is fully configured!');
  console.log('🎉 All features are available');
}

console.log('\n');