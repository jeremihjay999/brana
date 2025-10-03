const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/branakids';

async function createSuperAdmin() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('admin_users');
    
    // Check if super admin already exists
    const existingSuperAdmin = await collection.findOne({ role: 'super_admin' });
    if (existingSuperAdmin) {
      console.log('Super admin already exists:', existingSuperAdmin.email);
      return;
    }
    
    // Super admin credentials
    const superAdminData = {
      name: 'Super Admin',
      email: 'superadmin@branakids.co.ke',
      password: await bcrypt.hash('SuperAdmin123!', 10),
      role: 'super_admin',
      status: 'active',
      permissions: [
        'manage_users',
        'manage_products',
        'manage_categories',
        'manage_orders',
        'manage_customers',
        'manage_inventory',
        'manage_promotions',
        'manage_banners',
        'manage_settings',
        'view_analytics',
        'manage_admins',
        'system_settings'
      ],
      createdAt: new Date(),
      lastLogin: null,
      isSuperAdmin: true
    };
    
    // Insert super admin
    const result = await collection.insertOne(superAdminData);
    console.log('Super admin created successfully!');
    console.log('Email:', superAdminData.email);
    console.log('Password: SuperAdmin123!');
    console.log('User ID:', result.insertedId);
    
    // Create indexes for better performance
    await collection.createIndex({ email: 1 }, { unique: true });
    await collection.createIndex({ role: 1 });
    await collection.createIndex({ status: 1 });
    console.log('Database indexes created');
    
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await client.close();
  }
}

// Run the script
createSuperAdmin();

