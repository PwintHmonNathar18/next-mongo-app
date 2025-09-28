"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function CategoryPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
  const [categoryList, setCategoryList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();

  async function fetchCategory() {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/category`);
      
      if (response.status === 401) {
        // Not authenticated, redirect to home
        console.log('Not authenticated, redirecting...');
        router.push('/');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const c = await response.json();
      const c2 = c.map((category) => ({ ...category, id: category._id }));
      setCategoryList(c2);
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (error.message.includes('401')) {
        router.push('/');
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  function handleCategoryFormSubmit(data) {
    if (editMode) {
      // Update existing category - using PUT to /api/category
      fetch(`${API_BASE}/category`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((response) => {
        if (response.ok) {
          stopEditMode();
          fetchCategory();
        }
      });
      return;
    }
    // Create new category - using POST to /api/category
    fetch(`${API_BASE}/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        fetchCategory();
        reset(); // Clear form
      }
    });
  }

  function startEditMode(category) {
    reset(category);
    setEditMode(true);
  }

  function stopEditMode() {
    reset({ name: '', order: '' });
    setEditMode(false);
  }

  async function deleteCategory(category) {
    if (!confirm(`Are you sure to delete [${category.name}]`)) return;
    const id = category._id;
    
    const response = await fetch(`${API_BASE}/category/${id}`, { 
      method: "DELETE" 
    });
    
    if (response.ok) {
      fetchCategory();
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex justify-center items-center h-64">
          <div className="text-blue-900 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main>
        <form onSubmit={handleSubmit(handleCategoryFormSubmit)}>
          <div className="grid grid-cols-2 gap-4 w-fit m-4 bg-white p-6 rounded-lg shadow border border-blue-200">
            <div className="text-blue-900 font-semibold">Category name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-blue-400 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900 text-sm"
              />
            </div>
            <div className="text-blue-900 font-semibold">Order:</div>
            <div>
              <input
                name="order"
                type="number"
                {...register("order", { required: true })}
                className="border border-blue-400 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900 text-sm"
              />
            </div>
            <div className="col-span-2 text-right mt-4">
              {editMode ? (
                <>
                  <input
                    type="submit"
                    className="italic bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow cursor-pointer"
                    value="Update"
                  />
                  {' '}
                  <button
                    type="button"
                    onClick={stopEditMode}
                    className="italic bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full ml-2"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <input
                  type="submit"
                  value="Add"
                  className="w-20 italic bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow cursor-pointer"
                />
              )}
            </div>
          </div>
        </form>
        
        <div className="mx-4 mt-8 bg-blue-50 rounded-lg shadow p-4">
          <h1 className="text-2xl text-blue-900 font-bold mb-4">
            Category ({categoryList.length})
          </h1>
          <table className="min-w-full bg-white border border-blue-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-800 text-white">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Order</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {categoryList.map((row) => (
                <tr key={row._id} className="border-b border-blue-100 hover:bg-blue-100">
                  <td className="py-2 px-4 text-blue-900 font-semibold">{row.name}</td>
                  <td className="py-2 px-4 text-blue-900">{row.order}</td>
                  <td className="py-2 px-4">
                    <button 
                      className="text-blue-700 bg-white border border-blue-400 rounded px-2 py-1 mr-2 hover:bg-blue-50"
                      onClick={() => startEditMode(row)}
                    >
                      📝
                    </button>
                    <button 
                      className="text-blue-700 bg-white border border-blue-400 rounded px-2 py-1 hover:bg-blue-50"
                      onClick={() => deleteCategory(row)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}