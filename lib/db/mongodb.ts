import mongoose from 'mongoose';

// Mongoose configuration for better performance
if (process.env.NODE_ENV === 'production') {
  mongoose.set('strictQuery', true);
}

// Maintain a cached connection across hot reloads in development
// to prevent connections growing exponentially
// Use a unique global key to avoid conflicts
declare global {
  // eslint-disable-next-line no-var
  var __mongoose_conn: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  } | undefined;
}

let cached = globalThis.__mongoose_conn;

if (!cached) {
  cached = globalThis.__mongoose_conn = { conn: null, promise: null };
}

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI || '';
  
  if (!MONGODB_URI) {
    console.error('❌ MongoDB URI is missing');
    throw new Error(
      'Please define the MONGODB_URI environment variable in .env or .env.local'
    );
  }

  // Validate MongoDB URI format
  if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
    console.error('❌ Invalid MongoDB URI format');
    throw new Error('MongoDB URI must start with mongodb:// or mongodb+srv://');
  }

  if (cached && cached.conn) {
    return cached.conn;
  }

  if (cached && !cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    } as any;

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((m) => {
        console.log('✅ MongoDB connected successfully to:', MONGODB_URI.split('@')[1]?.split('/')[0] || 'database');
        return m;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection failed:', error.message);
        cached!.promise = null;
        throw error;
      });
  }

  try {
    cached!.conn = await cached!.promise!;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectDB;
