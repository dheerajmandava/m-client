'use client'
import { useAuth } from '@clerk/nextjs'
import { UserButton, SignedIn } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  Store,
  Menu,
  X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export default function Layout({ children }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { getToken, isLoaded, userId } = useAuth()
  const [hasShop, setHasShop] = useState(false)

  useEffect(() => {
    async function checkShopProfile() {
      if (!isLoaded || !userId) return
      try {
        const token = await getToken()
        const response = await api.getShopProfile(token)
        setHasShop(!!response.data)
      } catch (error) {
        setHasShop(false)
      }
    }
    checkShopProfile()
  }, [isLoaded, userId, getToken])

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/jobs', label: 'Jobs', icon: Briefcase },
    ...(hasShop ? [
      { href: '/jobs/new', label: 'New Job', icon: PlusCircle },
      { href: '/shop/profile', label: 'Shop Profile', icon: Store },
    ] : [
      { href: '/shop/new', label: 'Create Shop', icon: Store }
    ])
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 
        w-64 bg-white shadow-lg
        transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo and user profile */}
          <div className="h-16 flex items-center justify-between px-6 border-b">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Mechanix</span>
            </Link>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center px-6 py-3 text-sm font-medium
                    transition-colors duration-150 ease-in-out
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
} 