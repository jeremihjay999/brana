const { MongoClient } = require('mongodb')

async function updateCategoryIcons() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db("tech-ecommerce")
    const collection = db.collection("categories")

    // Define icon mappings
    const iconUpdates = [
      { name: "Audio", icon: "Headphones" },
      { name: "Smartphone & Tablets", icon: "Smartphone" },
      { name: "test", icon: "Cpu" },
      // Add more categories as needed
    ]

    // Update each category
    for (const update of iconUpdates) {
      const result = await collection.updateOne(
        { name: update.name },
        { $set: { icon: update.icon } }
      )
      console.log(`Updated ${update.name} with icon ${update.icon}: ${result.modifiedCount} document(s) modified`)
    }

    // Verify updates
    const categories = await collection.find({}).toArray()
    console.log("\nUpdated categories:")
    categories.forEach(cat => {
      console.log(`${cat.name}: ${cat.icon}`)
    })

  } catch (error) {
    console.error("Error updating category icons:", error)
  } finally {
    await client.close()
  }
}

updateCategoryIcons() 