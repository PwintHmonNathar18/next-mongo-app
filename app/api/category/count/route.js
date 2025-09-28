import dbConnect from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  await dbConnect();
  
  try {
    const count = await Category.countDocuments();
    return Response.json({ count });
  } catch (error) {
    console.error('Error counting categories:', error);
    return Response.json({ error: 'Failed to count categories' }, { status: 500 });
  }
}
