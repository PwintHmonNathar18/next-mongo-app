import { auth } from "../../../../auth";
import Product from "../../../../models/Product";
import Category from "../../../../models/Category";
import connect from "../../../../lib/db";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    
    if (!session) {
      return Response.json({ message: 'You must be signed in' }, { status: 401 });
    }

    await connect();
    console.log("GET params:", params);
    const id = params.id;
    const product = await Product.findById(id).populate("category");
    console.log("Found product:", product);
    return Response.json(product);
  } catch (error) {
    console.error('Error in GET /api/product/[id]:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    
    if (!session) {
      return Response.json({ message: 'You must be signed in' }, { status: 401 });
    }

    await connect();
    const id = params.id;
    const result = await Product.findByIdAndDelete(id);
    return Response.json(result);
  } catch (error) {
    console.error('Error in DELETE /api/product/[id]:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    
    if (!session) {
      return Response.json({ message: 'You must be signed in' }, { status: 401 });
    }

    await connect();
    const id = params.id;
    const data = await request.json();
    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
    return Response.json(updatedProduct);
  } catch (error) {
    console.error('Error in PATCH /api/product/[id]:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}