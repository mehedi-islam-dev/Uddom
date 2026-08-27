import mongoose, { Mongoose } from 'mongoose';

/**
 * Global cache to prevent multiple connections in development (hot reload)
 * and across serverless function invocations.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

async function connectDB(): Promise<Mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    const msg =
      '[MongoDB] ❌ MONGODB_URI environment variable is not defined. ' +
      'Please add it to your .env file.';
    console.error(msg);
    throw new Error(msg);
  }

  // Return cached connection if already established
  if (cached.conn) {
    console.log('[MongoDB] ✅ Using cached connection.');
    return cached.conn;
  }

  // If no pending connection promise, create one
  if (!cached.promise) {
    console.log('[MongoDB] 🔄 Initiating new connection...');

    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      // --- KEY FIX ---
      // Forces Node.js DNS resolution to use IPv4 (A records) instead of
      // IPv6 (AAAA records). This bypasses local ISP/DNS issues where
      // querySrv (used by MongoDB Atlas SRV connection strings) gets
      // ECONNREFUSED on IPv6 loopback (::1).
      family: 4,
      // Reasonable timeouts for serverless environments
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        console.log('[MongoDB] ✅ Successfully connected to database.');
        return mongooseInstance;
      })
      .catch((error: Error) => {
        // On failure, clear the promise so the next request retries
        console.error('[MongoDB] ❌ Connection failed!');
        console.error(`[MongoDB] Error name: ${error.name}`);
        console.error(`[MongoDB] Error message: ${error.message}`);
        if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
          console.error(
            '[MongoDB] 💡 Hint: This looks like a DNS/IPv6 issue. ' +
            'Make sure "family: 4" is set (it is) and check your MONGODB_URI is correct.'
          );
        }
        // Clear promise so retry is possible on next invocation
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Ensure promise is cleared on await failure too
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
