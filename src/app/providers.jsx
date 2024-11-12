'use client'

import { QueryProvider } from '@/providers/QueryProvider'
import { ShopProvider } from '@/contexts/ShopContext'

export default function Providers({ children }) {
  return (
    <QueryProvider>
      <ShopProvider>
        {children}
      </ShopProvider>
    </QueryProvider>
  )
}