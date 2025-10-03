import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI not set, using default local MongoDB connection');
  process.env.MONGODB_URI = 'mongodb://localhost:27017/branakids';
}

const uri = process.env.MONGODB_URI
const options = {
  // Only use SSL/TLS for production MongoDB Atlas connections
  ...(uri.startsWith('mongodb+srv://') ? {
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true,
  } : {}),
  serverSelectionTimeoutMS: 5000, // 5 seconds
  connectTimeoutMS: 10000, // 10 seconds
}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise 

// Helper function to connect to the database
export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    // Use the database name from environment variable or default to "tech-ecommerce"
    const db = client.db(process.env.MONGODB_DB || "tech-ecommerce");
    return { client, db };
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw new Error("Database connection failed");
  }
} 