import { auth } from "../../../../auth";
import Category from "../../../../models/Category";
import connect from "../../../../lib/db";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    
    if (!session) {
      return Response.json({ message: 'You must be signed in' }, { status: 401 });
    }

    const id = params.id;
    await connect();
    const category = await Category.findById(id)
    return Response.json(category);
  } catch (error) {
    console.error('Error in GET /api/category/[id]:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    
    if (!session) {
      return Response.json({ message: 'You must be signed in' }, { status: 401 });
    }

    const id = params.id;
    await connect();
    const category = await Category.findByIdAndDelete(id)
    return Response.json(category);
  } catch (error) {
    console.error('Error in DELETE /api/category/[id]:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}