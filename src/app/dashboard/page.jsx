'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import JobStatusCard from '@/components/JobStatusCard'
import { api } from '@/lib/api'

export default function DashboardPage() {
  const { getToken, isLoaded, userId } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      if (!isLoaded || !userId) {
        console.log('Auth not loaded or no user ID');
        return;
      }
      
      try {
        console.log('Fetching token...');
        const token = await getToken();
        
        if (!token) {
          throw new Error('Authentication token not available');
        }
        
        console.log('Fetching jobs...');
        const response = await api.getJobCards(token);
        const jobsData = response.jobs || [];
        console.log('Jobs fetched:', jobsData);
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError(error.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [isLoaded, userId, getToken]);

  if (!isLoaded) {
    return <div>Loading authentication...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Job Cards</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div>No jobs found</div>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <JobStatusCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 