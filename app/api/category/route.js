import { auth } from "../../../auth";
import Category from "../../../models/Category";
import connect from "../../../lib/db";

export async function GET(request) {
  try {
    const session = await auth();
    
    if (!session) {
      return Response.json({ message: 'You must be signed in' }, { status: 401 });
    }

    await connect();
    console.log('GET /api/category', request.nextUrl.searchParams.get("pno"));
    
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
      const categories = await Category.find(query)
        .sort({ order: -1 })
        .skip(startIndex)
        .limit(size);
      console.log(`Categories page ${pno} (size ${size}):`, categories);
      return Response.json(categories);
    }

    const categories = await Category.find(query).sort({ order: -1 });
    console.log("All categories:", categories);
    return Response.json(categories);
  } catch (error) {
    console.error('Error in GET /api/category:', error);
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
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    const body = await request.json()
    console.log('Creating category with:', body);
    const category = new Category(body)
    await category.save()
    console.log('Created category:', category);
    return Response.json(category)
  } catch (error) {
    console.error('Error in POST /api/category:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// for V2
export async function PUT(request) {
  try {
    const session = await auth();
    
    if (!session) {
      return Response.json({ message: 'You must be signed in' }, { status: 401 });
    }

    const body = await request.json()
    await connect();
    const category = await Category.findByIdAndUpdate(body._id, body, { new: true })
    return Response.json(category)
  } catch (error) {
    console.error('Error in PUT /api/category:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}