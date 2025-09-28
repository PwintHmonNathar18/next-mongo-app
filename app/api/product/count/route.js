import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  await dbConnect();
  
  try {
    const count = await Product.countDocuments();
    return Response.json({ count });
  } catch (error) {
    console.error('Error counting products:', error);
    return Response.json({ error: 'Failed to count products' }, { status: 500 });
  }
}
