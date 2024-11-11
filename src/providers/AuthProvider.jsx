'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { setAuthToken } from '@/lib/axiosClient';
import { useQueryClient } from '@tanstack/react-query';

export function AuthProvider({ children }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const updateToken = async () => {
      try {
        if (!isLoaded || !isSignedIn) {
          setAuthToken(null);
          queryClient.clear();
          return;
        }
        
        const token = await getToken();
        setAuthToken(token);
        
        queryClient.invalidateQueries();
      } catch (error) {
        console.error('Error setting auth token:', error);
        setAuthToken(null);
      }
    };

    updateToken();
    const interval = setInterval(updateToken, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, [getToken, isLoaded, isSignedIn, queryClient]);

  if (!isLoaded) {
    return null;
  }

  return children;
}