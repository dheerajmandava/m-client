'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from '@/lib/api'

export default function CreateShopPage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function checkExistingShop() {
      try {
        const token = await getToken()
        const response = await api.getShopProfile(token)
        
        if (response.data) {
          // If shop exists, redirect to profile page
          router.replace('/shop/profile')
        }
      } catch (error) {
        // Only continue loading the create form if it's a 404 (no shop found)
        if (error.status === 404) {
          setLoading(false)
        } else {
          setError('Failed to check shop profile')
          console.error('Error:', error)
        }
      }
    }

    checkExistingShop()
  }, [getToken, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Checking shop profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Rest of your existing create shop form code...
  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Shop Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Your existing form JSX */}
        </CardContent>
      </Card>
    </div>
  )
} 