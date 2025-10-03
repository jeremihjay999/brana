const { MongoClient } = require('mongodb')

async function updateFeaturedCategories() {
  const uri = process.env.MONGODB_URI
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db("tech-ecommerce")
    const collection = db.collection("categories")

    // Update categories to set featured status
    const result = await collection.updateMany(
      { name: { $in: ["Smartphone & Tablets", "Audio"] } }, // Update these categories
      { $set: { featured: true } }
    )

    console.log(`Updated ${result.modifiedCount} categories to featured`)
  } catch (error) {
    console.error("Error updating categories:", error)
  } finally {
    await client.close()
  }
}

updateFeaturedCategories() 