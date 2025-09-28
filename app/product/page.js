"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  

  // Pagination and search state
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // MUI DataGrid uses 0-based indexing
    pageSize: 5,
  });
  const [search, setSearch] = useState("");

  async function fetchProducts(page = 0, pageSize = 5, searchValue = "") {
    try {
      // Calculate page number for API (1-based indexing)
      const pno = page + 1;
      const searchParam = searchValue ? `&s=${encodeURIComponent(searchValue)}` : "";
      // Fetch paginated products with search
      const data = await fetch(`${API_BASE}/product?pno=${pno}&size=${pageSize}${searchParam}`);
      const p = await data.json();
      setProducts(p);
      // Fetch total count (with search)
      const countUrl = searchValue ? `${API_BASE}/product/count?s=${encodeURIComponent(searchValue)}` : `${API_BASE}/product/count`;
      const countData = await fetch(countUrl);
      const countResult = await countData.json();
      setTotalCount(countResult.count);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to fetch all products if pagination fails
      const data = await fetch(`${API_BASE}/product`);
      const p = await data.json();
      setProducts(p);
      setTotalCount(p.length);
    }
  }

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    setCategory(c);
  }

  const createProduct = (data) => {
    console.log('Form data being submitted:', data);
    
    // Validate required fields
    if (!data.code || !data.name || !data.description || !data.price || !data.category || !data.stock) {
      alert('Please fill out all required fields');
      return;
    }
    
    fetch(`${API_BASE}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      return response.json();
    })
    .then(() => {
      fetchProducts(paginationModel.page, paginationModel.pageSize);
      reset(); // Clear the form after successful creation
      alert('Product created successfully!');
    })
    .catch(error => {
      console.error('Error creating product:', error);
      alert('Error creating product. Please try again.');
    });
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    reset({
      code: product.code,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?._id || product.category, // Handle both object and string
      stock: product.stock,
    });
  };

  const updateProduct = (data) => {
    fetch(`${API_BASE}/product/${editingProduct._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      return response.json();
    })
    .then(() => {
      setEditingProduct(null);
      fetchProducts(paginationModel.page, paginationModel.pageSize);
      reset();
      alert('Product updated successfully!');
    })
    .catch(error => {
      console.error('Error updating product:', error);
      alert('Error updating product. Please try again.');
    });
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;
    await fetch(`${API_BASE}/product/${id}`, {
      method: "DELETE",
    });
    fetchProducts(paginationModel.page, paginationModel.pageSize);
  };


  useEffect(() => {
    fetchCategory();
    fetchProducts(paginationModel.page, paginationModel.pageSize, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel.page, paginationModel.pageSize, search]);

  // Handle pagination changes
  const handlePaginationModelChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
    // fetchProducts will be triggered by useEffect
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPaginationModel((prev) => ({ ...prev, page: 0 })); // Reset to first page on search
  };

  const columns = [
    { field: 'code', headerName: 'Code', width: 120 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'description', headerName: 'Description', width: 200 },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 100,
      renderCell: (params) => `$${params.row.price}`
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 150, 
      renderCell: (params) => {
        const cat = params.row?.category;
        return cat?.name || 'No Category';
      }
    },
    { field: 'stock', headerName: 'Stock', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-1">
          <Link href={`/product/${params.row._id}`}>
            <button className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs">
              View
            </button>
          </Link>
          <button
            onClick={() => startEdit(params.row)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
          >
            Edit
          </button>
          <button
            onClick={deleteById(params.row._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
          >
            Delete
          </button>
        </div>
      ),
      sortable: false,
      filterable: false,
    }
  ];

  const rows = products.map((p) => ({
    id: p._id,
    ...p,
  }));

  return (
  <div className="min-h-screen bg-white">
    {/* Top Section: Add and Edit Forms */}
    <div className="flex flex-col lg:flex-row gap-4 mt-8">
      {/* Add Product Form */}
      <div className="lg:w-1/2">
        <h2 className="text-2xl text-blue-900 font-bold mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit(createProduct)}>
          <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow border border-blue-200">
            <div className="text-blue-900 font-semibold">Code:</div>
            <div>
              <input
                name="code"
                type="text"
                {...register("code", { required: "Code is required" })}
                className={`border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 ${
                  errors.code ? 'border-red-500 focus:ring-red-300' : 'border-blue-400 focus:ring-blue-300'
                }`}
              />
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
            </div>
            <div className="text-blue-900 font-semibold">Name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                className={`border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-300' : 'border-blue-400 focus:ring-blue-300'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div className="text-blue-900 font-semibold">Description:</div>
            <div>
              <textarea
                name="description"
                {...register("description", { required: true })}
                className="border border-blue-400 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="text-blue-900 font-semibold">Price:</div>
            <div>
              <input
                name="price"
                type="number"
                {...register("price", { required: true })}
                className="border border-blue-400 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="text-blue-900 font-semibold">Category:</div>
            <div>
              <select
                name="category"
                {...register("category", { required: true })}
                className="border border-blue-400 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Select a category</option>
                {category.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="text-blue-900 font-semibold">Stock:</div>
            <div>
              <input
                name="stock"
                type="number"
                {...register("stock", { required: true })}
                className="border border-blue-400 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="col-span-2 flex justify-center mt-4">
              <input
                type="submit"
                value="Add"
                className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow"
              />
            </div>
          </div>
        </form>
      </div>
      
      {/* Edit Product Form */}
      {editingProduct && (
        <div className="lg:w-1/2">
          <h2 className="text-2xl text-blue-900 font-bold mb-4">Edit Product</h2>
          <form onSubmit={handleSubmit(updateProduct)}>
            <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow border border-blue-200">
            <div className="text-blue-900 font-semibold">Code:</div>
            <div>
              <input
                name="code"
                type="text"
                {...register("code", { required: true })}
                className="border border-blue-400 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="text-blue-900 font-semibold">Name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-blue-400 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="text-blue-900 font-semibold">Description:</div>
            <div>
              <textarea
                name="description"
                {...register("description", { required: true })}
                className="border border-blue-400 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="text-blue-900 font-semibold">Price:</div>
            <div>
              <input
                name="price"
                type="number"
                {...register("price", { required: true })}
                className="border border-blue-400 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="text-blue-900 font-semibold">Category:</div>
            <div>
              <select
                name="category"
                {...register("category", { required: true })}
                className="border border-blue-400 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Select a category</option>
                {category.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="text-blue-900 font-semibold">Stock:</div>
            <div>
              <input
                name="stock"
                type="number"
                {...register("stock", { required: true })}
                className="border border-blue-400 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="col-span-2 flex justify-center mt-4 gap-2">
              <input
                type="submit"
                value="Update"
                className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow"
              />
              <button type="button" onClick={() => setEditingProduct(null)} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full shadow">Cancel</button>
            </div>
          </div>
        </form>
        </div>
      )}
    </div>

    {/* Product DataGrid Section */}
    <div className="mt-8 bg-blue-50 rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h1 className="text-2xl text-blue-900 font-bold">Products ({totalCount} total, showing {products.length})</h1>
        <input
          type="text"
          placeholder="Search products by name..."
          value={search}
          onChange={handleSearchChange}
          className="border border-blue-400 rounded px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={totalCount}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          paginationMode="server"
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
          loading={products.length === 0 && totalCount > 0}
        />
      </div>
    </div>
  </div>
  );
}