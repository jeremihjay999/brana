const { MongoClient } = require('mongodb')

async function updateFeaturedProducts() {
  const uri = process.env.MONGODB_URI
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db("tech-ecommerce")
    const collection = db.collection("products")

    // Update products to set featured status
    const result = await collection.updateMany(
      { category: "Smartphone & Tablets" }, // Update products in this category
      { $set: { featured: true } }
    )

    console.log(`Updated ${result.modifiedCount} products to featured`)
  } catch (error) {
    console.error("Error updating products:", error)
  } finally {
    await client.close()
  }
}

updateFeaturedProducts() 