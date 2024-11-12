'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          if (error?.response?.status === 401) {
            return failureCount < 1;
          }
          return failureCount < 2;
        },
        staleTime: 1000 * 60 * 5,
      },
      mutations: {
        retry: (failureCount, error) => {
          if (error?.response?.status === 401) {
            return failureCount < 1;
          }
          return false;
        },
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}