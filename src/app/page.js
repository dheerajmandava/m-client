'use client';

import { useAuth, SignedOut, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        router.push('/dashboard');
      } else {
        router.push('/sign-in');
      }
    }
  }, [isLoaded, isSignedIn, router]);

  return null;
}
