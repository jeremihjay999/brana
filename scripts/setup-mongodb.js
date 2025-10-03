const fs = require('fs');
const path = require('path');

// MongoDB Atlas connection string (free tier)
const MONGODB_URI = 'mongodb+srv://branakids:branakids123@cluster0.mongodb.net/branakids?retryWrites=true&w=majority';

// Environment file content
const envContent = `# MongoDB Configuration
MONGODB_URI=${MONGODB_URI}
MONGODB_DB=branakids

# JWT Secret for Admin Authentication
JWT_SECRET=your-super-secret-jwt-key-for-brana-kids-2024

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-nextauth-secret-key

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Admin Configuration
ADMIN_EMAIL=superadmin@gmail.com
ADMIN_PASSWORD=superadmin123
`;

// Create .env.local file
const envPath = path.join(process.cwd(), '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully!');
  console.log('📝 MongoDB Atlas connection configured');
  console.log('🔑 Admin credentials: superadmin@gmail.com / superadmin123');
  console.log('\n🚀 Next steps:');
  console.log('1. Run: npm run seed-data');
  console.log('2. Start the app: npm run dev');
  console.log('3. Visit: http://localhost:3002/products');
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  console.log('\n📝 Please create .env.local manually with this content:');
  console.log(envContent);
}

