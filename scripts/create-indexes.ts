#!/usr/bin/env node
import { connectDB, disconnectDB, createIndexes } from '@/lib/db/mongoose';

/**
 * Create all MongoDB indexes
 * Run with: npm run db:indexes
 */
async function main() {
  console.log('\n📇 MongoDB Index Creation\n');
  console.log('━'.repeat(50));
  
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Create indexes
    const startTime = Date.now();
    await createIndexes();
    const duration = Date.now() - startTime;
    
    console.log(`\n⏱️  Completed in ${duration}ms\n`);
    console.log('✅ All indexes created successfully!\n');

  } catch (error) {
    console.error('❌ Index creation failed:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

// Run if this is the main module
if (require.main === module) {
  main();
}

export default main;