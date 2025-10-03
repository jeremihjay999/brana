const { MongoClient } = require('mongodb');
const fs = require('fs');

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const envVars = {};
    envFile.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    return envVars;
  } catch (error) {
    return {};
  }
}

async function testConnection() {
  const env = loadEnv();
  const MONGODB_URI = env.MONGODB_URI || 'mongodb+srv://jayjeremy2000:jayjeremy2000@cluster0.azg0k7p.mongodb.net/branakids';
  const DB_NAME = 'branakids';
  
  console.log('🔌 Testing MongoDB connection...');
  console.log('📍 URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
  
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // 5 seconds
    connectTimeoutMS: 10000, // 10 seconds
    retryWrites: true,
    w: 'majority'
  });
  
  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    const db = client.db(DB_NAME);
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    // Test a simple operation
    const testCollection = db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Test document inserted successfully!');
    
    // Clean up test document
    await testCollection.deleteOne({ test: 'connection' });
    console.log('🧹 Test document cleaned up');
    
    console.log('\n🎉 MongoDB connection is working perfectly!');
    console.log('🚀 You can now run: npm run seed-data');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Verify the MongoDB Atlas cluster is running');
      console.log('3. Check if your IP is whitelisted in MongoDB Atlas');
    }
    
    if (error.message.includes('authentication')) {
      console.log('\n💡 Authentication failed. Please check:');
      console.log('1. Username and password in the connection string');
      console.log('2. Database user permissions in MongoDB Atlas');
    }
    
  } finally {
    await client.close();
  }
}

testConnection();
