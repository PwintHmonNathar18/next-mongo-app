import Link from "next/link";

export default async function ProductDetail({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const data = await fetch(`${API_BASE}/product/${params.id}`, { cache: "no-store" });
  const product = await data.json();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="w-full bg-blue-800 py-4 px-8 flex items-center justify-between shadow">
        <h1 className="text-white text-2xl font-bold tracking-wide">VMES</h1>
        <Link href="/product">
          <button className="bg-white text-blue-800 px-4 py-2 rounded hover:bg-gray-100">
            Back to Products
          </button>
        </Link>
      </div>
      
      <div className="max-w-2xl mx-auto mt-8 bg-blue-50 rounded-lg shadow p-8 border border-blue-200">
        <h1 className="text-3xl text-blue-900 font-bold mb-6">Product Details</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <span className="block text-blue-900 font-semibold mb-1">Code:</span>
            <span className="text-lg text-blue-800 font-mono bg-white px-2 py-1 rounded border">
              {product.code}
            </span>
          </div>
          
          <div className="mb-4">
            <span className="block text-blue-900 font-semibold mb-1">Stock:</span>
            <span className={`text-lg px-2 py-1 rounded ${
              product.stock > 10 ? 'bg-green-100 text-green-800' : 
              product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {product.stock} units
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <span className="block text-blue-900 font-semibold mb-1">Name:</span>
          <span className="text-2xl text-blue-800 font-bold">{product.name}</span>
        </div>
        
        <div className="mb-4">
          <span className="block text-blue-900 font-semibold mb-1">Description:</span>
          <p className="text-blue-900 bg-white p-3 rounded border leading-relaxed">
            {product.description}
          </p>
        </div>
        
        <div className="mb-4">
          <span className="block text-blue-900 font-semibold mb-1">Price:</span>
          <span className="text-2xl text-green-600 font-bold">${product.price}</span>
        </div>
        
        <div className="mb-6">
          <span className="block text-blue-900 font-semibold mb-1">Category:</span>
          <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
            {product.category?.name || 'No Category'}
          </span>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Link href={`/product/${product._id}/edit`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
              Edit Product
            </button>
          </Link>
          <Link href="/product">
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded">
              Back to List
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
