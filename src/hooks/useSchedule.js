import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export function useSchedule(startDate, endDate) {
  const queryClient = useQueryClient();

  const scheduleQuery = useQuery({
    queryKey: ['schedule', startDate, endDate],
    queryFn: () => api.schedule.fetchSchedule(startDate, endDate),
    enabled: !!startDate
  });

  const assignJobMutation = useMutation({
    mutationFn: ({ jobId, scheduleData }) => 
      api.schedule.assignJob(jobId, scheduleData),
    onSuccess: () => {
      queryClient.invalidateQueries(['schedule']);
      queryClient.invalidateQueries(['upcomingJobs']);
      toast.success('Job scheduled successfully');
    }
  });

  const modifyScheduleMutation = useMutation({
    mutationFn: ({ jobId, scheduleData }) => 
      api.schedule.modifyJobSchedule(jobId, scheduleData),
    onSuccess: () => {
      queryClient.invalidateQueries(['schedule']);
      queryClient.invalidateQueries(['upcomingJobs']);
      toast.success('Schedule updated successfully');
    }
  });

  const removeScheduleMutation = useMutation({
    mutationFn: (jobId) => api.schedule.removeJobSchedule(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries(['schedule']);
      queryClient.invalidateQueries(['upcomingJobs']);
      toast.success('Schedule removed successfully');
    }
  });

  return {
    schedule: scheduleQuery.data,
    isLoading: scheduleQuery.isLoading,
    error: scheduleQuery.error,
    assignJob: assignJobMutation.mutate,
    modifySchedule: modifyScheduleMutation.mutate,
    removeSchedule: removeScheduleMutation.mutate,
    isAssigning: assignJobMutation.isPending,
    isModifying: modifyScheduleMutation.isPending,
    isRemoving: removeScheduleMutation.isPending
  };
} 