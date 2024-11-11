import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import Providers from './providers'
import Layout from '@/components/Layout'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${inter.className} h-full bg-gray-50`}>
          <Providers>
            <SignedIn>
              <Layout>{children}</Layout>
            </SignedIn>
            <SignedOut>
              {children}
            </SignedOut>
            <Toaster position="top-right" />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}