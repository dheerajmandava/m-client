'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, Clock, Timer, CheckCircle, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/dashboard/StatsCard';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import RecentJobsList from '@/components/dashboard/RecentJobsList';
import UpcomingJobs from '@/components/dashboard/UpcomingJobs';
import { useJobs } from '@/hooks/useJobs';
import useDashboardStats from '@/hooks/useDashboardStats';

export default function DashboardPage() {
  const router = useRouter();
  const { jobs: allJobs, isLoading: jobsLoading } = useJobs();
  const { stats, trends, isLoading: statsLoading } = useDashboardStats();

  if (jobsLoading || statsLoading) return <div>Loading...</div>;

  // Calculate recent jobs (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentJobs = allJobs.filter(job => {
    const date = new Date(job.createdAt);
    return date >= thirtyDaysAgo;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <WelcomeSection />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Jobs"
          value={stats.total}
          icon={Wrench}
          trend={trends.total}
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          trend={trends.pending}
          trendColor="yellow"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={Timer}
          trend={trends.inProgress}
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
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
              <PlusCircle className="mr-2 h-4 w-4" />
              New Job
            </Button>
          </CardHeader>
          <CardContent>
            <RecentJobsList jobs={recentJobs} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingJobs />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 