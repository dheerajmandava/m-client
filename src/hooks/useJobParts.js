import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export function useJobParts(jobId) {
  const queryClient = useQueryClient();

  const partsQuery = useQuery({
    queryKey: ['jobParts', jobId],
    queryFn: () => api.jobs.fetchParts(jobId),
    select: (data) => ({
      parts: data.parts || [],
      totalCost: data.totalCost || 0
    })
  });

  const addPartMutation = useMutation({
    mutationFn: (data) => api.jobs.addJobPart(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobParts', jobId]);
      toast.success('Part added successfully');
    }
  });

  const installPartMutation = useMutation({
    mutationFn: (partId) => api.jobs.installJobPart(jobId, partId),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobParts', jobId]);
      toast.success('Part marked as installed');
    }
  });

  const returnPartMutation = useMutation({
    mutationFn: ({ partId, reason }) => api.jobs.returnJobPart(jobId, partId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobParts', jobId]);
      queryClient.invalidateQueries(['inventory']);
      toast.success('Part returned successfully');
    }
  });

  return {
    parts: partsQuery.data?.parts || [],
    totalCost: partsQuery.data?.totalCost || 0,
    isLoading: partsQuery.isLoading,
    error: partsQuery.error,
    addPart: addPartMutation.mutate,
    installPart: installPartMutation.mutate,
    returnPart: returnPartMutation.mutate,
    isAdding: addPartMutation.isPending,
    isInstalling: installPartMutation.isPending,
    isReturning: returnPartMutation.isPending
  };
}