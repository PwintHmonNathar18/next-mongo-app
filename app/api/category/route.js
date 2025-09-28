import Category from "@/models/Category";
import dbConnect from "@/lib/db";

export async function GET(request) {
  await dbConnect();
  console.log('GET /api/category', request.nextUrl.searchParams.get("pno"));
  
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
    const categories = await Category.find(query)
      .sort({ order: -1 })
      .skip(startIndex)
      .limit(size);
    console.log(`Categories page ${pno} (size ${size}):`, categories);
    return Response.json(categories);
  }

  // Return all categories
  const categories = await Category.find(query).sort({ order: -1 });
  console.log("All categories:", categories);
  return Response.json(categories);
}

export async function POST(request) {
  await dbConnect();
  console.log('MONGODB_URI:', process.env.MONGODB_URI);
  const body = await request.json()
  console.log('Creating category with:', body);
  const category = new Category(body)
  await category.save()
  console.log('Created category:', category);
  return Response.json(category)
}



// for V2
export async function PUT(request) {
  const body = await request.json()
  const category = await Category.findByIdAndUpdate(body._id, body)
  return Response.json(category)
}