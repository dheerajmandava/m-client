'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { api } from '@/lib/api'

export default function NewJobPage() {
  const router = useRouter()
  const { isLoaded, userId, getToken } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  
  const [jobData, setJobData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    registrationNo: '',
    mileage: '',
    description: '',
    estimatedCost: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (!isLoaded || !userId) {
        throw new Error('Please sign in to create a job')
      }

      const token = await getToken()
      if (!token) {
        throw new Error('Authentication failed')
      }

      await api.createJobCard(jobData, token)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating job:', error)
      setError(error.message || 'Failed to create job')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setJobData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isLoaded || !userId) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32">
            Loading...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Job Card</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={jobData.customerName}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={jobData.customerPhone}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={jobData.customerEmail}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Make</label>
                <input
                  type="text"
                  name="vehicleMake"
                  value={jobData.vehicleMake}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  name="vehicleModel"
                  value={jobData.vehicleModel}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <input
                  type="text"
                  name="vehicleYear"
                  value={jobData.vehicleYear}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Registration Number</label>
                <input
                  type="text"
                  name="registrationNo"
                  value={jobData.registrationNo}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mileage</label>
                <input
                  type="number"
                  name="mileage"
                  value={jobData.mileage}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Job Details</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={jobData.description}
                onChange={handleChange}
                rows="4"
                className="w-full border rounded-md p-2"
                required
                disabled={isSubmitting}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estimated Cost</label>
              <input
                type="number"
                name="estimatedCost"
                value={jobData.estimatedCost}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
            `}
          >
            {isSubmitting ? 'Creating...' : 'Create Job Card'}
          </button>
        </form>
      </CardContent>
    </Card>
  )
} 