import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export function useJobScheduling(jobId) {
  const queryClient = useQueryClient();

  const scheduleMutation = useMutation({
    mutationFn: (scheduleData) => api.jobs.updateSchedule(jobId, scheduleData),
    onSuccess: () => {
      queryClient.invalidateQueries(['job', jobId]);
      queryClient.invalidateQueries(['upcomingJobs']);
      toast.success('Job scheduled successfully');
    }
  });

  return {
    scheduleJob: scheduleMutation.mutate,
    isScheduling: scheduleMutation.isPending,
    error: scheduleMutation.error
  };
} 