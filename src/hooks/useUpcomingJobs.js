import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function useUpcomingJobs() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['upcomingJobs'],
    queryFn: () => api.jobs.fetchUpcoming(),
    select: (jobs) => jobs
      .filter(job => job.scheduledDate && new Date(job.scheduledDate) >= new Date())
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
      .slice(0, 5)
  });

  return {
    jobs: data || [],
    isLoading,
    error
  };
} 