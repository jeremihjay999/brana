import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("tech-ecommerce")
    const allOrders = await db.collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    return NextResponse.json(allOrders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const body = await request.json()
    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }
    const client = await clientPromise
    const db = client.db("tech-ecommerce")
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    )
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    const updatedOrder = await db.collection("orders").findOne({ _id: new ObjectId(id) })
    return NextResponse.json({ message: "Order updated successfully", order: updatedOrder })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }
    const client = await clientPromise
    const db = client.db("tech-ecommerce")
    const result = await db.collection("orders").deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Order deleted successfully" })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("tech-ecommerce");
    const result = await db.collection("orders").insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: body.status || "pending"
    });
    return NextResponse.json({ message: "Order created successfully", orderId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
} 