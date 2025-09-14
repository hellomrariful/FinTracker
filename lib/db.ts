/**
 * Database connection management
 * Re-exports database utilities for easy access
 */

// Re-export all database utilities from mongoose
export { 
  connectDB,
  disconnectDB,
  isConnected,
  getDBStats,
  createIndexes,
  withTransaction,
  healthCheck,
} from './db/mongoose';

// Also export connectDB as default for backward compatibility
export { connectDB as default } from './db/mongoose';