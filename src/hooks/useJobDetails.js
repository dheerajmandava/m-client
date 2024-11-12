import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export function useJobDetails(jobId) {
  const queryClient = useQueryClient();

  const jobQuery = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => api.jobs.fetchOne(jobId),
    enabled: !!jobId
  });

  const updateJobMutation = useMutation({
    mutationFn: (data) => api.jobs.updateJob(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['job', jobId]);
      toast.success('Job updated successfully');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data) => api.jobs.updateJobStatus(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['job', jobId]);
      toast.success('Status updated successfully');
    }
  });

  return {
    job: jobQuery.data,
    isLoading: jobQuery.isLoading,
    error: jobQuery.error,
    updateJob: updateJobMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateJobMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending
  };
} 