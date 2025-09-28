"use client";
import * as React from "react";
import Link from 'next/link';
import Box from "@mui/material/Box";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const hasQuery = window.location.search.length > 0;
    const alreadyRedirected = sessionStorage.getItem("redirected");

    if (hasQuery && !alreadyRedirected) {
      sessionStorage.setItem("redirected", "true");
      router.replace("/app/stock");
    }
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-blue-900 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="flex flex-col items-center justify-center mt-16">
        <Box component="section" className="bg-blue-50 border border-blue-300 rounded-lg shadow p-8 text-center max-w-lg w-full">
          <h1 className="text-3xl text-blue-900 font-bold mb-6">Stock Management v1.0</h1>
          
          {session ? (
            // Show app features when signed in
            <div>
              <p className="text-gray-600 mb-6">Welcome back! Manage your inventory efficiently.</p>
              <ul className="space-y-4">
                <li>
                  <a href="/product" className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow inline-block">Products</a>
                </li>
                <li>
                  <a href="/category" className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow inline-block">Category</a>
                </li>
              </ul>
            </div>
          ) : (
            // Show sign-in button when not signed in
            <div>
              <p className="text-gray-600 mb-6">Please sign in to access the stock management system.</p>
              <button
                onClick={() => signIn('github', { callbackUrl: '/' })}
                className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow text-lg"
              >
                Sign In with GitHub
              </button>
              <div className="mt-6 text-sm text-gray-500">
                <p>You'll be able to:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Manage products and categories</li>
                  <li>• Track inventory levels</li>
                  <li>• Organize your stock efficiently</li>
                </ul>
              </div>
            </div>
          )}
        </Box>
      </main>
    </div>
  );
}