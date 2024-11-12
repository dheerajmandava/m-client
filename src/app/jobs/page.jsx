'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { useJobs } from '@/hooks/useJobs'

export default function JobsPage() {
  const router = useRouter()
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'ALL'
  })

  const { jobs, isLoading, error } = useJobs()

  if (isLoading) return <JobsLoadingSkeleton />
  if (error) return <div>Error loading jobs: {error.message}</div>

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.customerName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      job.vehicleMake.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      job.vehicleModel.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      job.registrationNo.toLowerCase().includes(filters.searchTerm.toLowerCase())

    const matchesStatus = filters.status === 'ALL' || job.status === filters.status

    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Button onClick={() => router.push('/jobs/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Job
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search jobs..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="max-w-sm"
            />
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredJobs.map(job => (
          <JobCard 
            key={job.id} 
            job={job}
            onClick={() => router.push(`/jobs/${job.id}`)}
          />
        ))}
      </div>
    </div>
  )
} 