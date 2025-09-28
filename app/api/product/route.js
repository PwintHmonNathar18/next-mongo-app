import { auth } from "../../../auth";
import Product from "../../../models/Product";
import Category from "../../../models/Category";
import connect from "../../../lib/db";

export async function GET(request) {
  try {
    const session = await auth();
    
    if (!session) {
      return Response.json({ message: 'You must be signed in' }, { status: 401 });
    }

    await connect();
    console.log('GET /api/product', request.nextUrl.searchParams.get("pno"));
    
    const searchParams = request.nextUrl.searchParams;
    const pno = searchParams.get("pno");
    const size = parseInt(searchParams.get("size")) || 10;
    const s = searchParams.get("s");

    let query = {};
    if (s) {
      query.name = { $regex: s, $options: 'i' };
    }

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

    const products = await Product.find(query).populate("category").sort({ _id: -1 });
    console.log("Products from DB:", JSON.stringify(products, null, 2));
    return Response.json(products);
  } catch (error) {
    console.error('Error in GET /api/product:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    
    if (!session) {
      return Response.json({ message: 'You must be signed in' }, { status: 401 });
    }

    await connect();
    const body = await request.json();
    console.log("Creating product with data:", body);
    const product = new Product(body);
    await product.save();
    return Response.json(product);
  } catch (error) {
    console.error('Error in POST /api/product:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    
    if (!session) {
      return Response.json({ message: 'You must be signed in' }, { status: 401 });
    }

    const body = await request.json();
    const { _id, ...updateData } = body;
    await connect();
    const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
    if (!product) {
      return new Response("Product not found", { status: 404 });
    }
    return Response.json(product);
  } catch (error) {
    console.error('Error in PUT /api/product:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await auth();
    
    if (!session) {
      return Response.json({ message: 'You must be signed in' }, { status: 401 });
    }

    const body = await request.json();
    const { _id, ...updateData } = body;
    await connect();
    const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
    if (!product) {
      return new Response("Product not found", { status: 404 });
    }
    return Response.json(product);
  } catch (error) {
    console.error('Error in PATCH /api/product:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}