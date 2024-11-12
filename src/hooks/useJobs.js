import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export function useJobs() {
  const queryClient = useQueryClient();

  const jobsQuery = useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.jobs.fetchAll()
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id) => api.jobs.removeJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job deleted successfully');
    }
  });

  return {
    jobs: jobsQuery.data || [],
    isLoading: jobsQuery.isLoading,
    error: jobsQuery.error,
    deleteJob: deleteJobMutation.mutate,
    isDeleting: deleteJobMutation.isPending
  };
} 