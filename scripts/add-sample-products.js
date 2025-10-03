const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://branakids:branakids123@cluster0.mongodb.net/branakids?retryWrites=true&w=majority';

const sampleProducts = [
  {
    name: "LEGO Classic Creative Bricks",
    description: "Build anything you can imagine with this classic LEGO set",
    category: "Building Blocks",
    price: 2500,
    stock: 20,
    status: "in-stock",
    images: [{ url: "/placeholder.svg", type: "file" }],
    isDeal: false,
    featured: true,
    tags: ["building", "creative", "classic"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Barbie Dreamhouses",
    description: "Beautiful dollhouse for imaginative play",
    category: "Dolls & Accessories",
    price: 5000,
    stock: 8,
    status: "in-stock",
    images: [{ url: "/placeholder.svg", type: "file" }],
    isDeal: true,
    dealPrice: 5000,
    previousPrice: 8500,
    featured: true,
    tags: ["dollhouse", "barbie", "imagination"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Fisher-Price Learning Laptop",
    description: "Educational laptop for toddlers",
    category: "Educational Toys",
    price: 1800,
    stock: 15,
    status: "in-stock",
    images: [{ url: "/placeholder.svg", type: "file" }],
    isDeal: false,
    featured: true,
    tags: ["educational", "laptop", "learning"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "VTech Kidizoom Camera",
    description: "Digital camera designed for kids",
    category: "Electronic Toys",
    price: 2900,
    stock: 12,
    status: "in-stock",
    images: [{ url: "/placeholder.svg", type: "file" }],
    isDeal: false,
    featured: true,
    tags: ["camera", "digital", "electronic"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "LEGO Technic Race Car",
    description: "Build and race with this amazing LEGO Technic set",
    category: "Building Blocks",
    price: 3400,
    stock: 10,
    status: "in-stock",
    images: [{ url: "/placeholder.svg", type: "file" }],
    isDeal: true,
    dealPrice: 3400,
    previousPrice: 3800,
    featured: true,
    tags: ["lego", "technic", "race car"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Colorful Building Blocks Set",
    description: "Vibrant building blocks for creative play",
    category: "Building Blocks",
    price: 1200,
    stock: 25,
    status: "in-stock",
    images: [{ url: "/placeholder.svg", type: "file" }],
    isDeal: true,
    dealPrice: 1200,
    previousPrice: 1800,
    featured: false,
    tags: ["building", "colorful", "creative"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Toy Cars Collection",
    description: "Set of 6 die-cast toy cars",
    category: "Toys",
    price: 800,
    stock: 30,
    status: "in-stock",
    images: [{ url: "/placeholder.svg", type: "file" }],
    isDeal: true,
    dealPrice: 800,
    previousPrice: 1200,
    featured: false,
    tags: ["cars", "die-cast", "collection"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Spinning Top Set",
    description: "Traditional spinning tops with modern design",
    category: "Toys",
    price: 600,
    stock: 20,
    status: "in-stock",
    images: [{ url: "/placeholder.svg", type: "file" }],
    isDeal: false,
    featured: false,
    tags: ["spinning", "traditional", "wooden"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function addSampleProducts() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('branakids');
    const collection = db.collection('products');
    
    // Clear existing products
    await collection.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    const result = await collection.insertMany(sampleProducts);
    console.log(`Added ${result.insertedCount} sample products`);
    
    console.log('Sample products added successfully!');
    
  } catch (error) {
    console.error('Error adding sample products:', error);
  } finally {
    await client.close();
  }
}

addSampleProducts();

