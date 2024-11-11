'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import JobCard from '@/components/jobs/JobCard'
import JobsLoadingSkeleton from '@/components/jobs/JobsLoadingSkeleton'
import { api } from '@/lib/api'

export default function JobsPage() {
  const router = useRouter()
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'ALL'
  })

  // Fetch jobs data
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.getJobCards()
  })

  const jobs = jobsData?.data || []

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Filter jobs based on search and status
  const filteredJobs = jobs.filter(job => {
    if (filters.status !== 'ALL' && job.status !== filters.status) {
      return false
    }
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase()
      return (
        job.customerName?.toLowerCase().includes(searchTerm) ||
        job.registrationNo?.toLowerCase().includes(searchTerm) ||
        `${job.vehicleMake} ${job.vehicleModel}`.toLowerCase().includes(searchTerm)
      )
    }
    return true
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Filters and Search */}
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Search jobs..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  className="w-64"
                />
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => router.push('/jobs/new')}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Job
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid gap-6" style={{ gridTemplateColumns: '1fr' }}>
          {/* Jobs List */}
          <div className="grid gap-4 auto-rows-min">
            {isLoading ? (
              <JobsLoadingSkeleton />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onScheduleClick={() => router.push(`/jobs/${job.id}/schedule`)}
                    onViewDetails={() => router.push(`/jobs/${job.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 