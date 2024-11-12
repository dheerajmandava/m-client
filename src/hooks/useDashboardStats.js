import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function useDashboardStats() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const jobs = await api.jobs.fetchAll();
      
      const now = new Date();
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const sixtyDaysAgo = new Date(now);
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const recentJobs = jobs.filter(job => {
        const date = new Date(job.createdAt);
        return date >= thirtyDaysAgo;
      });

      const previousJobs = jobs.filter(job => {
        const date = new Date(job.createdAt);
        return date >= sixtyDaysAgo && date < thirtyDaysAgo;
      });

      const stats = {
        total: jobs.length,
        pending: jobs.filter(job => job.status === 'PENDING').length,
        inProgress: jobs.filter(job => job.status === 'IN_PROGRESS').length,
        completed: jobs.filter(job => job.status === 'COMPLETED').length
      };

      const calculateTrend = (recent, previous) => {
        if (previous === 0) return recent > 0 ? 100 : 0;
        return Math.round(((recent - previous) / previous) * 100);
      };

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
      };

      return { stats, trends, recentJobs, allJobs: jobs };
    }
  });

  return {
    stats: data?.stats || {},
    trends: data?.trends || {},
    jobs: data?.allJobs || [],
    recentJobs: data?.recentJobs || [],
    isLoading,
    error
  };
} 