'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function TestAuth() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      
      <div className="mb-4">
        <p>Status: {status}</p>
        <p>Session: {session ? JSON.stringify(session) : 'No session'}</p>
      </div>

      {session ? (
        <div>
          <p>Welcome, {session.user?.name || session.user?.email}!</p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => signIn('github')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sign In with GitHub
          </button>
        </div>
      )}
    </div>
  );
}