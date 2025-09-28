'use client';

import { useEffect } from 'react';
import { signIn } from 'next-auth/react';

export default function SignInPage() {
  useEffect(() => {
    // Automatically trigger GitHub signin
    signIn('github', { callbackUrl: '/' });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to GitHub...</h1>
        <p>Please wait while we redirect you to GitHub for authentication.</p>
      </div>
    </div>
  );
}