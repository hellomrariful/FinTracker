/**
 * MongoDB connection management
 * Re-exports from the main mongoose connection manager
 */
export { 
  connectDB as default,
  connectDB,
  disconnectDB,
  isConnected,
  getDBStats,
  createIndexes,
  withTransaction,
  healthCheck
} from './mongoose';
