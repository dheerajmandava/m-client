'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { api } from '@/lib/api'

export default function JobsPage() {
  const router = useRouter();
  const { getToken, isLoaded, userId } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsShopProfile, setNeedsShopProfile] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      if (!isLoaded || !userId) return;
      
      try {
        const token = await getToken();
        const response = await api.getJobCards(token);
        setJobs(response.jobs || []);
        setNeedsShopProfile(!response.hasShop);
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Cards</h1>
        {!needsShopProfile && (
          <Button onClick={() => router.push('/jobs/new')}>
            <Plus className="mr-2 h-4 w-4" /> New Job Card
          </Button>
        )}
      </div>

      {loading ? (
        <div>Loading jobs...</div>
      ) : needsShopProfile ? (
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-gray-600 mb-4">Please create a shop profile to start managing job cards.</p>
            <Button onClick={() => router.push('/shop/new')}>
              Create Shop Profile
            </Button>
          </CardContent>
        </Card>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-gray-600 mb-4">No jobs found. Create your first job card!</p>
            <Button onClick={() => router.push('/jobs/new')}>
              Create Job Card
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card 
              key={job.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/jobs/${job.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{job.jobNumber}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-gray-600">{job.customerName}</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-gray-500">Vehicle</p>
                        <p className="text-sm">{job.vehicleMake} {job.vehicleModel} ({job.vehicleYear})</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Registration</p>
                        <p className="text-sm">{job.registrationNo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Created</p>
                        <p className="text-sm">{new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Estimated Cost</p>
                        <p className="text-sm font-medium">${job.estimatedCost}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    AWAITING_PARTS: 'bg-orange-100 text-orange-800',
    COMPLETED: 'bg-green-100 text-green-800',
    DELIVERED: 'bg-purple-100 text-purple-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
} 