import mongoose, { Connection } from 'mongoose';
import { config } from '@/lib/config/env';

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

/**
 * Global cached connection for serverless environments
 * This prevents creating multiple connections in serverless functions
 */
let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * MongoDB connection options
 */
const MONGODB_OPTIONS = {
  bufferCommands: false,
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 10000,
  maxIdleTimeMS: 10000,
};

/**
 * Connect to MongoDB with connection pooling and caching
 */
export async function connectDB(): Promise<Connection> {
  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // If connection promise exists, wait for it
  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn!;
    } catch (error) {
      // Reset on error
      cached.promise = null;
      throw error;
    }
  }

  if (!config.db.uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    // Create new connection promise
    cached.promise = mongoose.connect(config.db.uri, MONGODB_OPTIONS).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose.connection;
    });

    // Wait for connection
    cached.conn = await cached.promise;
    
    // Set up connection event handlers
    setupConnectionHandlers(cached.conn);
    
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Set up MongoDB connection event handlers
 */
function setupConnectionHandlers(connection: Connection) {
  connection.on('connected', () => {
    console.log('📊 MongoDB connection established');
  });

  connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error);
  });

  connection.on('disconnected', () => {
    console.log('🔌 MongoDB disconnected');
    // Clear cache on disconnect
    cached.conn = null;
    cached.promise = null;
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await cached.conn.close();
    cached.conn = null;
    cached.promise = null;
  }
}

/**
 * Check if MongoDB is connected
 */
export function isConnected(): boolean {
  return cached.conn?.readyState === 1;
}

/**
 * Get database statistics
 */
export async function getDBStats() {
  if (!isConnected()) {
    await connectDB();
  }
  
  if (!cached.conn || !cached.conn.db) {
    throw new Error('Database connection not available');
  }
  
  const admin = cached.conn.db.admin();
  const dbStats = await cached.conn.db.stats();
  const serverStatus = await admin.serverStatus();
  
  return {
    collections: dbStats.collections,
    dataSize: dbStats.dataSize,
    indexes: dbStats.indexes,
    connections: serverStatus.connections,
    uptime: serverStatus.uptime,
  };
}

/**
 * Create indexes for all models
 */
export async function createIndexes() {
  if (!isConnected()) {
    await connectDB();
  }

  console.log('📇 Creating MongoDB indexes...');
  
  try {
    // Import models to register them
    const models = [
      await import('@/lib/models/User'),
      await import('@/lib/models/Income'),
      await import('@/lib/models/Expense'),
      await import('@/lib/models/Asset'),
      await import('@/lib/models/Budget'),
      await import('@/lib/models/Goal'),
      await import('@/lib/models/Employee'),
      await import('@/lib/models/Category'),
    ];

    // Create indexes for each model
    for (const module of models) {
      const Model = module.default;
      if (Model && Model.createIndexes) {
        await Model.createIndexes();
        console.log(`  ✅ Indexes created for ${Model.modelName}`);
      }
    }

    console.log('✅ All indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    throw error;
  }
}

/**
 * MongoDB transaction helper
 */
export async function withTransaction<T>(
  callback: (session: mongoose.ClientSession) => Promise<T>
): Promise<T> {
  if (!isConnected()) {
    await connectDB();
  }

  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

/**
 * Health check for MongoDB connection
 */
export async function healthCheck(): Promise<{
  status: 'healthy' | 'unhealthy';
  latency: number;
  details: any;
}> {
  const start = Date.now();
  
  try {
    if (!isConnected()) {
      await connectDB();
    }
    
    // Ping database
    if (!cached.conn || !cached.conn.db) {
      throw new Error('Database connection not available');
    }
    
    await cached.conn.db.admin().ping();
    
    const latency = Date.now() - start;
    
    return {
      status: 'healthy',
      latency,
      details: {
        connected: true,
        readyState: cached.conn.readyState,
        host: cached.conn.host,
        name: cached.conn.name,
      },
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      latency: Date.now() - start,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        connected: false,
      },
    };
  }
}

export default connectDB;