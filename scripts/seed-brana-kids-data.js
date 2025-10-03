const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jayjeremy2000:jayjeremy2000@cluster0.azg0k7p.mongodb.net/branakids';
const DB_NAME = 'branakids';

// BRANA KIDS brand colors
const BRANA_COLORS = {
  green: '#22C55E',
  purple: '#8B5CF6', 
  blue: '#3B82F6',
  pink: '#EC4899',
  yellow: '#F59E0B'
};

// Categories data
const categories = [
  {
    name: 'Action Figures',
    description: 'Superheroes, characters, and adventure figures for imaginative play',
    icon: 'zap',
    slug: 'action-figures',
    featured: true,
    status: 'active',
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    color: BRANA_COLORS.blue,
    ageGroups: ['3-5 years', '6-8 years', '9-12 years']
  },
  {
    name: 'Arts & Crafts',
    description: 'Creative supplies and craft kits to inspire young artists',
    icon: 'palette',
    slug: 'arts-crafts',
    featured: true,
    status: 'active',
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    color: BRANA_COLORS.pink,
    ageGroups: ['3-5 years', '6-8 years', '9-12 years']
  },
  {
    name: 'Board Games',
    description: 'Family fun games that teach strategy and social skills',
    icon: 'puzzle',
    slug: 'board-games',
    featured: true,
    status: 'active',
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    color: BRANA_COLORS.purple,
    ageGroups: ['6-8 years', '9-12 years', '13+ years']
  },
  {
    name: 'Building Blocks',
    description: 'LEGO, blocks, and construction sets for creative building',
    icon: 'gamepad2',
    slug: 'building-blocks',
    featured: true,
    status: 'active',
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    color: BRANA_COLORS.green,
    ageGroups: ['0-2 years', '3-5 years', '6-8 years', '9-12 years']
  },
  {
    name: 'Dolls & Accessories',
    description: 'Dolls, accessories, and role-play toys for nurturing play',
    icon: 'heart',
    slug: 'dolls-accessories',
    featured: true,
    status: 'active',
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    color: BRANA_COLORS.pink,
    ageGroups: ['3-5 years', '6-8 years', '9-12 years']
  },
  {
    name: 'Educational',
    description: 'Learning toys and educational games for school readiness',
    icon: 'book-open',
    slug: 'educational',
    featured: true,
    status: 'active',
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    color: BRANA_COLORS.blue,
    ageGroups: ['0-2 years', '3-5 years', '6-8 years', '9-12 years']
  },
  {
    name: 'Electronic Toys',
    description: 'Interactive electronic toys with lights, sounds, and movement',
    icon: 'zap',
    slug: 'electronic-toys',
    featured: false,
    status: 'active',
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    color: BRANA_COLORS.yellow,
    ageGroups: ['3-5 years', '6-8 years', '9-12 years']
  },
  {
    name: 'Outdoor Toys',
    description: 'Bikes, scooters, and outdoor play equipment for active fun',
    icon: 'car',
    slug: 'outdoor-toys',
    featured: false,
    status: 'active',
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    color: BRANA_COLORS.green,
    ageGroups: ['3-5 years', '6-8 years', '9-12 years', '13+ years']
  },
  {
    name: 'Musical Toys',
    description: 'Instruments and musical toys to inspire young musicians',
    icon: 'music',
    slug: 'musical-toys',
    featured: false,
    status: 'active',
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    color: BRANA_COLORS.purple,
    ageGroups: ['0-2 years', '3-5 years', '6-8 years']
  },
  {
    name: 'Baby Toys',
    description: 'Safe and stimulating toys for babies and toddlers',
    icon: 'baby',
    slug: 'baby-toys',
    featured: true,
    status: 'active',
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    color: BRANA_COLORS.pink,
    ageGroups: ['0-2 years', '3-5 years']
  },
  {
    name: 'Clothing',
    description: 'Comfortable and stylish children\'s clothing',
    icon: 'shirt',
    slug: 'clothing',
    featured: false,
    status: 'active',
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    color: BRANA_COLORS.blue,
    ageGroups: ['0-2 years', '3-5 years', '6-8 years', '9-12 years']
  },
  {
    name: 'Special Deals',
    description: 'Limited time offers and special promotions',
    icon: 'sparkles',
    slug: 'special-deals',
    featured: true,
    status: 'active',
    productCount: 0,
    subcategoryCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    color: BRANA_COLORS.yellow,
    ageGroups: ['0-2 years', '3-5 years', '6-8 years', '9-12 years', '13+ years']
  }
];

// Products data
const products = [
  // Action Figures
  {
    name: 'Superhero Action Figure Set',
    description: 'Complete set of 6 superhero action figures with accessories. Perfect for imaginative play and storytelling adventures.',
    category: 'Action Figures',
    price: 2500,
    stock: 15,
    status: 'in-stock',
    images: [
      { url: '/uploads/action-figures-1.jpg', type: 'file' },
      { url: '/uploads/action-figures-2.jpg', type: 'file' }
    ],
    isDeal: true,
    dealPrice: 2000,
    previousPrice: 2500,
    tags: ['Superhero', 'Interactive', '9-12 years', 'Imaginative Play'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Dinosaur Adventure Pack',
    description: 'Realistic dinosaur figures with sound effects and educational information cards.',
    category: 'Action Figures',
    price: 1800,
    stock: 8,
    status: 'in-stock',
    images: [
      { url: '/uploads/dinosaur-pack-1.jpg', type: 'file' }
    ],
    isDeal: false,
    tags: ['Educational', 'Interactive', '6-8 years', 'Sound Effects'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Arts & Crafts
  {
    name: 'Creative Art Supplies Kit',
    description: 'Complete art kit with crayons, markers, paints, brushes, and drawing paper. Everything your little artist needs!',
    category: 'Arts & Crafts',
    price: 3200,
    stock: 12,
    status: 'in-stock',
    images: [
      { url: '/uploads/art-kit-1.jpg', type: 'file' },
      { url: '/uploads/art-kit-2.jpg', type: 'file' }
    ],
    isDeal: true,
    dealPrice: 2500,
    previousPrice: 3200,
    tags: ['Creative', 'Washable', '3-5 years', '6-8 years', 'Safe Materials'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Pottery Wheel for Kids',
    description: 'Safe, child-friendly pottery wheel with clay and tools. Develops fine motor skills and creativity.',
    category: 'Arts & Crafts',
    price: 4500,
    stock: 5,
    status: 'in-stock',
    images: [
      { url: '/uploads/pottery-wheel-1.jpg', type: 'file' }
    ],
    isDeal: false,
    tags: ['Creative', 'Educational', '6-8 years', '9-12 years', 'Motor Skills'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Board Games
  {
    name: 'Family Board Game Collection',
    description: 'Set of 4 classic board games perfect for family game night. Includes Monopoly Junior, Scrabble Junior, and more.',
    category: 'Board Games',
    price: 5500,
    stock: 10,
    status: 'in-stock',
    images: [
      { url: '/uploads/board-games-1.jpg', type: 'file' },
      { url: '/uploads/board-games-2.jpg', type: 'file' }
    ],
    isDeal: true,
    dealPrice: 4200,
    previousPrice: 5500,
    tags: ['Educational', 'Family', '6-8 years', '9-12 years', 'Strategy'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Educational Puzzle Set',
    description: 'Set of 6 jigsaw puzzles with different difficulty levels. Features animals, vehicles, and nature themes.',
    category: 'Board Games',
    price: 1800,
    stock: 20,
    status: 'in-stock',
    images: [
      { url: '/uploads/puzzle-set-1.jpg', type: 'file' }
    ],
    isDeal: false,
    tags: ['Educational', 'Problem Solving', '3-5 years', '6-8 years', 'Safe Materials'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Building Blocks
  {
    name: 'LEGO Classic Creative Bricks',
    description: '500-piece LEGO set with colorful bricks and building instructions. Encourages creativity and engineering skills.',
    category: 'Building Blocks',
    price: 3500,
    stock: 25,
    status: 'in-stock',
    images: [
      { url: '/uploads/lego-classic-1.jpg', type: 'file' },
      { url: '/uploads/lego-classic-2.jpg', type: 'file' }
    ],
    isDeal: true,
    dealPrice: 2800,
    previousPrice: 3500,
    tags: ['Creative', 'Educational', '3-5 years', '6-8 years', '9-12 years', 'Engineering'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Magnetic Building Blocks',
    description: 'Colorful magnetic building blocks that stick together easily. Perfect for toddlers and young children.',
    category: 'Building Blocks',
    price: 2200,
    stock: 18,
    status: 'in-stock',
    images: [
      { url: '/uploads/magnetic-blocks-1.jpg', type: 'file' }
    ],
    isDeal: false,
    tags: ['Educational', 'Safe Materials', '0-2 years', '3-5 years', 'Motor Skills'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Dolls & Accessories
  {
    name: 'Barbie Dreamhouse Playset',
    description: '3-story dreamhouse with furniture, accessories, and a working elevator. Hours of imaginative play!',
    category: 'Dolls & Accessories',
    price: 8500,
    stock: 6,
    status: 'in-stock',
    images: [
      { url: '/uploads/barbie-dreamhouse-1.jpg', type: 'file' },
      { url: '/uploads/barbie-dreamhouse-2.jpg', type: 'file' }
    ],
    isDeal: true,
    dealPrice: 6800,
    previousPrice: 8500,
    tags: ['Interactive', 'Imaginative Play', '3-5 years', '6-8 years', 'Role Play'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Baby Doll Care Set',
    description: 'Realistic baby doll with feeding accessories, clothes, and care items. Teaches nurturing and responsibility.',
    category: 'Dolls & Accessories',
    price: 2800,
    stock: 15,
    status: 'in-stock',
    images: [
      { url: '/uploads/baby-doll-1.jpg', type: 'file' }
    ],
    isDeal: false,
    tags: ['Educational', 'Role Play', '3-5 years', '6-8 years', 'Nurturing'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Educational
  {
    name: 'Interactive Learning Tablet',
    description: 'Child-safe tablet with educational games, stories, and activities. Perfect for learning letters, numbers, and colors.',
    category: 'Educational',
    price: 4200,
    stock: 12,
    status: 'in-stock',
    images: [
      { url: '/uploads/learning-tablet-1.jpg', type: 'file' }
    ],
    isDeal: true,
    dealPrice: 3500,
    previousPrice: 4200,
    tags: ['Educational', 'Interactive', 'Electronic', '3-5 years', '6-8 years', 'Battery Operated'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Alphabet Learning Blocks',
    description: 'Wooden alphabet blocks with letters, numbers, and pictures. Helps with early reading and counting skills.',
    category: 'Educational',
    price: 1500,
    stock: 30,
    status: 'in-stock',
    images: [
      { url: '/uploads/alphabet-blocks-1.jpg', type: 'file' }
    ],
    isDeal: false,
    tags: ['Educational', 'Safe Materials', '0-2 years', '3-5 years', 'Eco-Friendly'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Electronic Toys
  {
    name: 'Musical Keyboard for Kids',
    description: 'Colorful keyboard with 32 keys, built-in songs, and recording feature. Introduces children to music.',
    category: 'Electronic Toys',
    price: 3800,
    stock: 8,
    status: 'in-stock',
    images: [
      { url: '/uploads/keyboard-1.jpg', type: 'file' }
    ],
    isDeal: false,
    tags: ['Musical', 'Interactive', 'Battery Operated', '3-5 years', '6-8 years', 'Light & Sound'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Robot Pet Companion',
    description: 'Interactive robot pet that responds to touch and voice commands. Teaches coding basics through play.',
    category: 'Electronic Toys',
    price: 5500,
    stock: 4,
    status: 'in-stock',
    images: [
      { url: '/uploads/robot-pet-1.jpg', type: 'file' }
    ],
    isDeal: true,
    dealPrice: 4500,
    previousPrice: 5500,
    tags: ['Interactive', 'Educational', 'Battery Operated', '6-8 years', '9-12 years', 'Coding'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Outdoor Toys
  {
    name: 'Kids Bicycle with Training Wheels',
    description: 'Safe and sturdy bicycle with removable training wheels. Perfect for learning to ride.',
    category: 'Outdoor Toys',
    price: 12000,
    stock: 5,
    status: 'in-stock',
    images: [
      { url: '/uploads/bicycle-1.jpg', type: 'file' }
    ],
    isDeal: false,
    tags: ['Outdoor', 'Physical Activity', '3-5 years', '6-8 years', 'Safe Materials'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Scooter with LED Lights',
    description: '3-wheel scooter with LED lights and adjustable height. Great for outdoor fun and exercise.',
    category: 'Outdoor Toys',
    price: 4500,
    stock: 10,
    status: 'in-stock',
    images: [
      { url: '/uploads/scooter-1.jpg', type: 'file' }
    ],
    isDeal: true,
    dealPrice: 3800,
    previousPrice: 4500,
    tags: ['Outdoor', 'Physical Activity', '3-5 years', '6-8 years', 'LED Lights'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Musical Toys
  {
    name: 'Xylophone Music Set',
    description: 'Colorful xylophone with mallets and songbook. Introduces children to music and rhythm.',
    category: 'Musical Toys',
    price: 1800,
    stock: 15,
    status: 'in-stock',
    images: [
      { url: '/uploads/xylophone-1.jpg', type: 'file' }
    ],
    isDeal: false,
    tags: ['Musical', 'Educational', 'Safe Materials', '0-2 years', '3-5 years', '6-8 years'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Drum Set for Toddlers',
    description: 'Mini drum set with drumsticks and carrying case. Perfect for little musicians.',
    category: 'Musical Toys',
    price: 2500,
    stock: 8,
    status: 'in-stock',
    images: [
      { url: '/uploads/drum-set-1.jpg', type: 'file' }
    ],
    isDeal: true,
    dealPrice: 2000,
    previousPrice: 2500,
    tags: ['Musical', 'Interactive', '0-2 years', '3-5 years', 'Safe Materials'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Baby Toys
  {
    name: 'Soft Plush Teddy Bear',
    description: 'Ultra-soft teddy bear with gentle music box. Perfect for cuddling and comfort.',
    category: 'Baby Toys',
    price: 1200,
    stock: 25,
    status: 'in-stock',
    images: [
      { url: '/uploads/teddy-bear-1.jpg', type: 'file' }
    ],
    isDeal: false,
    tags: ['Soft', 'Safe Materials', '0-2 years', 'Comfort', 'Washable'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Baby Activity Gym',
    description: 'Colorful activity gym with hanging toys, mirrors, and music. Stimulates baby development.',
    category: 'Baby Toys',
    price: 3500,
    stock: 6,
    status: 'in-stock',
    images: [
      { url: '/uploads/activity-gym-1.jpg', type: 'file' }
    ],
    isDeal: true,
    dealPrice: 2800,
    previousPrice: 3500,
    tags: ['Educational', 'Interactive', 'Safe Materials', '0-2 years', 'Development'],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Clothing
  {
    name: 'Kids Cotton T-Shirt Set',
    description: 'Pack of 3 comfortable cotton t-shirts in fun colors and patterns. Machine washable.',
    category: 'Clothing',
    price: 1800,
    stock: 50,
    status: 'in-stock',
    images: [
      { url: '/uploads/tshirt-set-1.jpg', type: 'file' }
    ],
    isDeal: false,
    tags: ['Cotton', 'Washable', 'Comfortable', '3-5 years', '6-8 years', 'Eco-Friendly'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Winter Jacket for Kids',
    description: 'Warm and waterproof winter jacket with hood. Perfect for outdoor adventures.',
    category: 'Clothing',
    price: 4500,
    stock: 12,
    status: 'in-stock',
    images: [
      { url: '/uploads/winter-jacket-1.jpg', type: 'file' }
    ],
    isDeal: true,
    dealPrice: 3600,
    previousPrice: 4500,
    tags: ['Warm', 'Waterproof', 'Outdoor', '3-5 years', '6-8 years', '9-12 years'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Banners data
const banners = [
  {
    title: 'Welcome to BRANA KIDS',
    subtitle: 'Let Your Kid Smile!',
    description: 'Discover amazing toys, clothes, and educational products for your little ones',
    image: '/uploads/banner-1.jpg',
    buttonText: 'Shop Now',
    buttonLink: '/products',
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Special Deals',
    subtitle: 'Up to 50% Off',
    description: 'Limited time offers on selected toys and games',
    image: '/uploads/banner-2.jpg',
    buttonText: 'View Deals',
    buttonLink: '/deals',
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Educational Toys',
    subtitle: 'Learning Made Fun',
    description: 'Help your child learn and grow with our educational collection',
    image: '/uploads/banner-3.jpg',
    buttonText: 'Explore',
    buttonLink: '/category/educational',
    isActive: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Admin users data
const adminUsers = [
  {
    name: 'Super Admin',
    email: 'superadmin@gmail.com',
    password: '', // Will be hashed
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
      'system_settings',
      'view_reports',
      'manage_content',
      'manage_media'
    ],
    createdAt: new Date(),
    lastLogin: null,
    isSuperAdmin: true
  },
  {
    name: 'Admin User',
    email: 'admin@branakids.co.ke',
    password: '', // Will be hashed
    role: 'admin',
    status: 'active',
    permissions: [
      'manage_products',
      'manage_categories',
      'manage_orders',
      'manage_customers',
      'manage_inventory',
      'manage_promotions',
      'manage_banners',
      'view_analytics',
      'view_reports',
      'manage_content'
    ],
    createdAt: new Date(),
    lastLogin: null,
    isSuperAdmin: false
  }
];

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Clear existing data
    console.log('Clearing existing data...');
    await db.collection('categories').deleteMany({});
    await db.collection('products').deleteMany({});
    await db.collection('banners').deleteMany({});
    await db.collection('admin_users').deleteMany({});
    
    // Hash passwords
    console.log('Hashing passwords...');
    for (let user of adminUsers) {
      user.password = await bcrypt.hash('superadmin123', 10);
    }
    
    // Insert categories
    console.log('Inserting categories...');
    const categoryResult = await db.collection('categories').insertMany(categories);
    console.log(`Inserted ${categoryResult.insertedCount} categories`);
    
    // Update product counts in categories
    console.log('Updating category product counts...');
    for (let category of categories) {
      const productCount = products.filter(p => p.category === category.name).length;
      await db.collection('categories').updateOne(
        { name: category.name },
        { $set: { productCount } }
      );
    }
    
    // Insert products
    console.log('Inserting products...');
    const productResult = await db.collection('products').insertMany(products);
    console.log(`Inserted ${productResult.insertedCount} products`);
    
    // Insert banners
    console.log('Inserting banners...');
    const bannerResult = await db.collection('banners').insertMany(banners);
    console.log(`Inserted ${bannerResult.insertedCount} banners`);
    
    // Insert admin users
    console.log('Inserting admin users...');
    const userResult = await db.collection('admin_users').insertMany(adminUsers);
    console.log(`Inserted ${userResult.insertedCount} admin users`);
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Categories: ${categoryResult.insertedCount}`);
    console.log(`- Products: ${productResult.insertedCount}`);
    console.log(`- Banners: ${bannerResult.insertedCount}`);
    console.log(`- Admin Users: ${userResult.insertedCount}`);
    
    console.log('\n🔑 Admin Credentials:');
    console.log('Super Admin: superadmin@gmail.com / superadmin123');
    console.log('Admin: admin@branakids.co.ke / superadmin123');
    
    console.log('\n🎉 BRANA KIDS is ready to go!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run the seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
