import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export function useJobParts(jobId) {
  const queryClient = useQueryClient();

  const partsQuery = useQuery({
    queryKey: ['jobParts', jobId],
    queryFn: () => api.getJobParts(jobId),
    select: (data) => ({
      parts: data.parts || [],
      totalCost: data.totalCost || 0
    })
  });

  const installPartMutation = useMutation({
    mutationFn: (partId) => api.installJobPart(jobId, partId),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobParts', jobId]);
      toast.success('Part marked as installed');
    },
    onError: (error) => {
      toast.error(error.toString());
    }
  });

  const returnPartMutation = useMutation({
    mutationFn: ({ partId, reason }) => api.returnJobPart(jobId, partId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobParts', jobId]);
      queryClient.invalidateQueries(['inventory']);
      toast.success('Part returned successfully');
    },
    onError: (error) => {
      toast.error(error.toString());
    }
  });

  return {
    parts: partsQuery.data?.parts || [],
    totalCost: partsQuery.data?.totalCost || 0,
    isLoading: partsQuery.isLoading,
    error: partsQuery.error,
    installPart: installPartMutation.mutate,
    returnPart: returnPartMutation.mutate,
    isInstalling: installPartMutation.isPending,
    isReturning: returnPartMutation.isPending
  };
}