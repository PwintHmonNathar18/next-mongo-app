import { auth } from "../../../../auth";
import connect from "../../../../lib/db";
import Product from "../../../../models/Product";

// ... keep the rest of your existing code, just change the imports

export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return Response.json({ message: 'You must be signed in' }, { status: 401 });
    }

    await connect();
    
    try {
      const count = await Product.countDocuments();
      return Response.json({ count });
    } catch (error) {
      console.error('Error counting products:', error);
      return Response.json({ error: 'Failed to count products' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in GET /api/product/count:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}