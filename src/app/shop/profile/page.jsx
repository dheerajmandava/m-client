'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from '@/lib/api'

export default function ShopProfilePage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [shop, setShop] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    async function fetchShopProfile() {
      try {
        const token = await getToken()
        const response = await api.getShopProfile(token)
        const shopData = response.data
        setShop(shopData)
        setFormData({
          name: shopData.name || '',
          email: shopData.email || '',
          phone: shopData.phone || '',
          address: shopData.address || ''
        })
      } catch (error) {
        console.error('Error fetching shop:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchShopProfile()
  }, [getToken])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = await getToken()
      await api.updateShopProfile(formData, token)
      setIsEditing(false)
      // Refresh shop data
      const response = await api.getShopProfile(token)
      setShop(response.data)
    } catch (error) {
      console.error('Error updating shop:', error)
      setError(error.message)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Shop Profile</CardTitle>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Shop Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Shop Name</label>
                <p>{shop.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <p>{shop.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <p>{shop.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <p>{shop.address || 'Not provided'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 