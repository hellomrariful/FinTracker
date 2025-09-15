#!/usr/bin/env node
import { connectDB, disconnectDB, healthCheck, getDBStats } from '@/lib/db/mongoose';
import mongoose from 'mongoose';

/**
 * Check MongoDB health and statistics
 * Run with: npm run db:health
 */
async function checkDatabaseHealth() {
  console.log('\n🏥 MongoDB Health Check\n');
  console.log('═'.repeat(50));
  
  try {
    // Connect to database
    await connectDB();
    
    // Run health check
    const health = await healthCheck();
    
    console.log('\n📊 Connection Status:');
    console.log('━'.repeat(50));
    console.log(`  Status: ${health.status === 'healthy' ? '✅' : '❌'} ${health.status.toUpperCase()}`);
    console.log(`  Latency: ${health.latency}ms`);
    
    if (health.details.connected) {
      console.log(`  Host: ${health.details.host}`);
      console.log(`  Database: ${health.details.name}`);
      console.log(`  Ready State: ${health.details.readyState}`);
    } else {
      console.log(`  Error: ${health.details.error}`);
    }
    
    if (health.status === 'healthy') {
      // Get database statistics
      console.log('\n📈 Database Statistics:');
      console.log('━'.repeat(50));
      
      try {
        const stats = await getDBStats();
        console.log(`  Collections: ${stats.collections}`);
        console.log(`  Data Size: ${formatBytes(stats.dataSize)}`);
        console.log(`  Indexes: ${stats.indexes}`);
        console.log(`  Connections: ${JSON.stringify(stats.connections)}`);
        console.log(`  Uptime: ${formatUptime(stats.uptime)}`);
      } catch (error) {
        console.log('  ⚠️  Could not fetch detailed statistics');
      }
      
      // Check collections
      console.log('\n📚 Collections:');
      console.log('━'.repeat(50));
      
      if (!mongoose.connection.db) {
        console.log('  ⚠️  Database connection not established');
      } else {
        const collections = await mongoose.connection.db.listCollections().toArray();
        
        for (const collection of collections) {
          const count = await mongoose.connection.db.collection(collection.name).countDocuments();
          const indexes = await mongoose.connection.db.collection(collection.name).indexes();
          console.log(`  • ${collection.name}: ${count} documents, ${indexes.length} indexes`);
        }
      }
      
      console.log('\n✅ Database is healthy and operational!\n');
    } else {
      console.log('\n❌ Database health check failed!\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format uptime in seconds to human readable format
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  
  return parts.join(' ') || '< 1m';
}

// Run if this is the main module
if (require.main === module) {
  checkDatabaseHealth();
}

export default checkDatabaseHealth;