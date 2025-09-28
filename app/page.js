"use client";
import * as React from "react";
import Link from 'next/link';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    const hasQuery = window.location.search.length > 0;
    const alreadyRedirected = sessionStorage.getItem("redirected");

    if (hasQuery && !alreadyRedirected) {
      sessionStorage.setItem("redirected", "true");
      router.replace("/app/stock");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="w-full bg-blue-800 py-4 px-8 flex items-center justify-between shadow">
        <h1 className="text-white text-2xl font-bold tracking-wide">VMES</h1>
      </div>
      <main className="flex flex-col items-center justify-center mt-16">
        <Box component="section" className="bg-blue-50 border border-blue-300 rounded-lg shadow p-8 text-center max-w-lg w-full">
          <h1 className="text-3xl text-blue-900 font-bold mb-6">Stock Management v1.0</h1>
          <ul className="space-y-4">
            <li>
              <a href="/product" className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow inline-block">Products</a>
            </li>
            <li>
              <a href="/category" className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow inline-block">Category</a>
            </li>
          </ul>
        </Box>
      </main>
    </div>
  );
}
