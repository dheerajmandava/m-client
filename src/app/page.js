'use client';

import { SignedIn, SignedOut, SignInButton, useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { setAuthToken } from '@/lib/axiosClient';

export default function Home() {
  const { getToken } = useAuth();

  // Set token immediately after sign in
  useEffect(() => {
    const setToken = async () => {
      const token = await getToken();
      if (token) {
        setAuthToken(token);
      }
    };
    setToken();
  }, [getToken]);

  return (
    <>
      <SignedIn>
        <RedirectToDashboard />
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl font-bold mb-8">Welcome to Mechanix</h1>
          <SignInButton mode="modal" afterSignInUrl="/dashboard">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
              Sign In to Continue
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}

function RedirectToDashboard() {
  if (typeof window !== 'undefined') {
    window.location.href = '/dashboard';
  }
  return null;
}
