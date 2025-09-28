"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
export default function Home() {
  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'order', headerName: 'Order', width: 150 },
    {
      field: 'Action', headerName: 'Action', width: 150,
      renderCell: (params) => (
        <div>
          <button className="text-blue-700 bg-white border border-blue-400 rounded px-2 py-1 mr-2" onClick={() => startEditMode(params.row)}>📝</button>
          <button className="text-blue-700 bg-white border border-blue-400 rounded px-2 py-1" onClick={() => deleteCategory(params.row)}>🗑️</button>
        </div>
      )
    },
  ];

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const [categoryList, setCategoryList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    const c2 = c.map((category) => ({ ...category, id: category._id }));
    setCategoryList(c2);
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  function handleCategoryFormSubmit(data) {
    if (editMode) {
      fetch(`${API_BASE}/category`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(() => {
        stopEditMode();
        fetchCategory();
      });
      return;
    }
    fetch(`${API_BASE}/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(() => fetchCategory());
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
    await fetch(`${API_BASE}/category/${id}`, { method: "DELETE" });
    fetchCategory();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="w-full bg-blue-800 py-4 px-8 flex items-center justify-between shadow">
        <h1 className="text-white text-2xl font-bold tracking-wide">VMES</h1>
      </div>
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
                    className="italic bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow"
                    value="Update"
                  />
                  {' '}
                  <button
                    type="button"
                    onClick={stopEditMode}
                    className="italic bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full ml-2"
                  >Cancel</button>
                </>
              ) : (
                <input
                  type="submit"
                  value="Add"
                  className="w-20 italic bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow"
                />
              )}
            </div>
          </div>
        </form>
        <div className="mx-4 mt-8 bg-blue-50 rounded-lg shadow p-4">
          <h1 className="text-2xl text-blue-900 font-bold mb-4">Category ({categoryList.length})</h1>
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
                    <button className="text-blue-700 bg-white border border-blue-400 rounded px-2 py-1 mr-2" onClick={() => startEditMode(row)}>📝</button>
                    <button className="text-blue-700 bg-white border border-blue-400 rounded px-2 py-1" onClick={() => deleteCategory(row)}>🗑️</button>
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
