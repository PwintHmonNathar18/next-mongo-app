'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="w-full bg-blue-800 py-4 px-8 flex items-center justify-between shadow">
        <h1 className="text-white text-2xl font-bold tracking-wide">VMES</h1>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-blue-800 py-4 px-8 flex items-center justify-between shadow">
      <h1 
        className="text-white text-2xl font-bold tracking-wide cursor-pointer"
        onClick={() => router.push('/')}
      >
        VMES
      </h1>
      
      <div className="flex items-center space-x-6">
        {session ? (
          <>
            <button
              className="text-white hover:text-blue-200 font-medium"
              onClick={() => router.push('/category')}
            >
              Categories
            </button>
            <button
              className="text-white hover:text-blue-200 font-medium"
              onClick={() => router.push('/product')}
            >
              Products
            </button>
          </>
        ) : null}
        
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <span className="text-white text-sm">
                Welcome, {session.user?.name || session.user?.email}
              </span>
              <button
                className="text-white hover:text-blue-200 font-medium border border-white px-3 py-1 rounded"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              className="text-white hover:text-blue-200 font-medium border border-white px-3 py-1 rounded"
              onClick={() => signIn('github', { callbackUrl: '/' })}
            >
              Sign In with GitHub
            </button>
          )}
        </div>
      </div>
    </div>
  );
}