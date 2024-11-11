'use client'

import { ShopProvider } from '@/contexts/ShopContext'
import { AuthProvider } from '@/providers/AuthProvider'
import { QueryProvider } from '@/providers/QueryProvider'

export default function Providers({ children }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ShopProvider>
          {children}
        </ShopProvider>
      </AuthProvider>
    </QueryProvider>
  )
} 