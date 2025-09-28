import Product from "@/models/Product";
import Category from "@/models/Category"; // Import Category model to register it
import dbConnect from "@/lib/db";

export async function GET(request) {
  await dbConnect();
  console.log('GET /api/product', request.nextUrl.searchParams.get("pno"));
  
  const searchParams = request.nextUrl.searchParams;
  const pno = searchParams.get("pno");
  const size = parseInt(searchParams.get("size")) || 10; // Default page size of 10
  const s = searchParams.get("s");

  // Build the base query
  let query = {};
  if (s) {
    query.name = { $regex: s, $options: 'i' };
  }

  // If pagination is requested
  if (pno) {
    const startIndex = (parseInt(pno) - 1) * size;
    const products = await Product.find(query)
      .populate("category")
      .sort({ _id: -1 })
      .skip(startIndex)
      .limit(size);
    console.log(`Products page ${pno} (size ${size}):`, JSON.stringify(products, null, 2));
    return Response.json(products);
  }

  // Return all products
  const products = await Product.find(query).populate("category").sort({ _id: -1 });
  console.log("Products from DB:", JSON.stringify(products, null, 2));
  return Response.json(products);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  console.log("Creating product with data:", body);
  const product = new Product(body);
  await product.save();
  return Response.json(product);
}

export async function PUT(request) {
  const body = await request.json();
  const { _id, ...updateData } = body;
  const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }
  return Response.json(product);
}

export async function PATCH(request) {
  const body = await request.json();
  const { _id, ...updateData } = body;
  const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }
  return Response.json(product);
}