#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('\n🔍 Checking environment configuration...\n');

// Required environment variables
const requiredVars = [
  { name: 'MONGODB_URI', description: 'MongoDB connection string', sensitive: true },
  { name: 'JWT_ACCESS_SECRET', description: 'JWT access token secret', sensitive: true },
  { name: 'JWT_REFRESH_SECRET', description: 'JWT refresh token secret', sensitive: true },
  { name: 'NEXT_PUBLIC_APP_URL', description: 'Application URL', sensitive: false },
];

// Optional environment variables
const optionalVars = [
  { name: 'EMAIL_FROM', description: 'From email address', sensitive: false },
  { name: 'SMTP_HOST', description: 'SMTP server host', sensitive: false },
  { name: 'SMTP_PORT', description: 'SMTP server port', sensitive: false },
  { name: 'SMTP_USER', description: 'SMTP username', sensitive: true },
  { name: 'SMTP_PASS', description: 'SMTP password', sensitive: true },
];

// Load environment variables
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

let allGood = true;

console.log('✅ Required Variables:');
console.log('─'.repeat(50));
requiredVars.forEach(({ name, description, sensitive }) => {
  const value = process.env[name];
  if (value) {
    const display = sensitive ? value.substring(0, 10) + '...' : value;
    console.log(`✅ ${name}: ${display}`);
    console.log(`   ${description}`);
  } else {
    console.log(`❌ ${name}: MISSING`);
    console.log(`   ${description}`);
    allGood = false;
  }
});

console.log('\n📦 Optional Variables:');
console.log('─'.repeat(50));
optionalVars.forEach(({ name, description, sensitive }) => {
  const value = process.env[name];
  if (value) {
    const display = sensitive ? '***' : value;
    console.log(`✅ ${name}: ${display}`);
  } else {
    console.log(`⚠️  ${name}: Not configured (${description})`);
  }
});

// Check MongoDB connection
if (process.env.MONGODB_URI) {
  console.log('\n🔗 MongoDB Connection:');
  console.log('─'.repeat(50));
  const uri = process.env.MONGODB_URI;
  if (uri.includes('mongodb+srv://')) {
    console.log('✅ Using MongoDB Atlas (cloud)');
  } else if (uri.includes('mongodb://')) {
    console.log('✅ Using MongoDB (local/custom)');
  }
  
  // Extract database name
  const dbName = uri.split('/').pop()?.split('?')[0] || 'default';
  if (dbName) {
    console.log(`   Database: ${dbName}`);
  }
}

console.log('\n' + '─'.repeat(50));
if (allGood) {
  console.log('✅ All required environment variables are configured!\n');
  process.exit(0);
} else {
  console.log('❌ Some required environment variables are missing.\n');
  console.log('Please create a .env.local file with the required variables.\n');
  process.exit(1);
}
