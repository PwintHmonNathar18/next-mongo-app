import Product from "@/models/Product";
import Category from "@/models/Category"; // Import Category model to register it
import dbConnect from "@/lib/db";

export async function GET(request, { params }) {
  await dbConnect();
  console.log("GET params:", params);
  const id = params.id;
  const product = await Product.findById(id).populate("category");
  console.log("Found product:", product);
  return Response.json(product);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const id = params.id;
  const result = await Product.findByIdAndDelete(id);
  return Response.json(result);
}

export async function PATCH(request, { params }) {
  await dbConnect();
  const id = params.id;
  const data = await request.json();
  const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
  return Response.json(updatedProduct);
}


