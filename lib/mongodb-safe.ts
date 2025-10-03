import { MongoClient } from "mongodb"

// Safe MongoDB connection that doesn't fail on import
let clientPromise: Promise<MongoClient> | null = null;

export async function getMongoClient() {
  if (!clientPromise) {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/branakids';
      
      const options = {
        // Only use SSL/TLS for production MongoDB Atlas connections
        ...(uri.startsWith('mongodb+srv://') ? {
          ssl: true,
          tls: true,
          tlsAllowInvalidCertificates: true,
        } : {}),
        serverSelectionTimeoutMS: 5000, // 5 seconds
        connectTimeoutMS: 10000, // 10 seconds
      };

      const client = new MongoClient(uri, options);
      clientPromise = client.connect();
    } catch (error) {
      console.error("Failed to initialize MongoDB client:", error);
      throw error;
    }
  }
  
  return clientPromise;
}

// Helper function to connect to the database
export async function connectToDatabase() {
  try {
    const client = await getMongoClient();
    const db = client.db(process.env.MONGODB_DB || "branakids");
    return { client, db };
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw new Error("Database connection failed");
  }
}

