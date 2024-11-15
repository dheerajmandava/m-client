'use client';

import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import Providers from './providers'
import Layout from '@/components/Layout'
import { usePathname } from 'next/navigation'
import './globals.css'
import { ShopProvider } from '@/contexts/ShopContext'

const inter = Inter({ subsets: ['latin'] })

const publicRoutes = ['/', '/sign-in', '/sign-up'];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <ShopProvider>
      <ClerkProvider
        appearance={{
          baseTheme: undefined,
          signIn: { routing: "path" },
          signUp: { routing: "path" }
        }}
      >
        <html lang="en" className="h-full">
          <body className={`${inter.className} h-full bg-gray-50`}>
            <Providers>
              {isPublicRoute ? children : <Layout>{children}</Layout>}
              <Toaster position="top-right" />
            </Providers>
          </body>
        </html>
      </ClerkProvider>
    </ShopProvider>
  )
}