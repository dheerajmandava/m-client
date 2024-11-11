'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { 
  Wrench, 
  Clock, 
  Timer, 
  CheckCircle 
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import StatsCard from '@/components/dashboard/StatsCard'
import RecentJobsList from '@/components/dashboard/RecentJobsList'
import UpcomingJobs from '@/components/dashboard/UpcomingJobs'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import { api } from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()

  const { data: shop, isLoading: shopLoading } = useQuery({
    queryKey: ['shop'],
    queryFn: () => api.getShopProfile()
  })

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.getJobCards()
  })

  const loading = shopLoading || jobsLoading
  const hasShop = shop

  // Calculate job statistics from jobs data
  const jobs = jobsData?.data || []
  const jobStats = jobs.reduce((stats, job) => {
    stats.total++
    switch (job.status) {
      case 'PENDING':
        stats.pending++
        break
      case 'IN_PROGRESS':
        stats.inProgress++
        break
      case 'COMPLETED':
        stats.completed++
        break
    }
    return stats
  }, {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  })

  // Calculate trends (last 30 days vs previous 30 days)
  const now = new Date()
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
  const sixtyDaysAgo = new Date(now.setDate(now.getDate() - 30))

  const recentJobs = jobs.filter(job => new Date(job.createdAt) >= thirtyDaysAgo)
  const previousJobs = jobs.filter(job => {
    const date = new Date(job.createdAt)
    return date >= sixtyDaysAgo && date < thirtyDaysAgo
  })

  const calculateTrend = (recent, previous) => {
    if (previous === 0) return recent > 0 ? 100 : 0
    return Math.round(((recent - previous) / previous) * 100)
  }

  const trends = {
    total: calculateTrend(recentJobs.length, previousJobs.length),
    pending: calculateTrend(
      recentJobs.filter(j => j.status === 'PENDING').length,
      previousJobs.filter(j => j.status === 'PENDING').length
    ),
    inProgress: calculateTrend(
      recentJobs.filter(j => j.status === 'IN_PROGRESS').length,
      previousJobs.filter(j => j.status === 'IN_PROGRESS').length
    ),
    completed: calculateTrend(
      recentJobs.filter(j => j.status === 'COMPLETED').length,
      previousJobs.filter(j => j.status === 'COMPLETED').length
    )
  }

  // Rest of your component remains the same, but update the StatsCard components:
  return (
    <div className="container mx-auto p-6 space-y-6">
      <WelcomeSection />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Jobs"
          value={jobStats.total}
          icon={Wrench}
          trend={trends.total}
        />
        <StatsCard
          title="Pending"
          value={jobStats.pending}
          icon={Clock}
          trend={trends.pending}
          trendColor="yellow"
        />
        <StatsCard
          title="In Progress"
          value={jobStats.inProgress}
          icon={Timer}
          trend={trends.inProgress}
        />
        <StatsCard
          title="Completed"
          value={jobStats.completed}
          icon={CheckCircle}
          trend={trends.completed}
          trendColor="green"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Jobs</CardTitle>
              <CardDescription>Latest job cards created</CardDescription>
            </div>
            <Button onClick={() => router.push('/jobs/new')}>
              New Job
            </Button>
          </CardHeader>
          <CardContent>
            <RecentJobsList jobs={jobs} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>Next 7 days appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingJobs jobs={jobs} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 