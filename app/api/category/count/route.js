import { auth } from "../../../../auth";
import connect from "../../../../lib/db";
import Category from "../../../../models/Category";



export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return Response.json({ message: 'You must be signed in' }, { status: 401 });
    }

    await connect();
    
    try {
      const count = await Category.countDocuments();
      return Response.json({ count });
    } catch (error) {
      console.error('Error counting categories:', error);
      return Response.json({ error: 'Failed to count categories' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in GET /api/category/count:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}