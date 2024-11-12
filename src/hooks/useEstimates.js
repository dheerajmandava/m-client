import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export function useEstimates(jobId) {
  const queryClient = useQueryClient();

  const estimatesQuery = useQuery({
    queryKey: ['estimates', jobId],
    queryFn: () => api.estimates.fetchForJob(jobId),
    enabled: !!jobId
  });

  const createEstimateMutation = useMutation({
    mutationFn: (data) => api.estimates.createEstimate(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['estimates', jobId]);
      toast.success('Estimate created successfully');
    }
  });

  const updateEstimateMutation = useMutation({
    mutationFn: ({ estimateId, data }) => api.estimates.updateEstimate(estimateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['estimates', jobId]);
      toast.success('Estimate updated successfully');
    }
  });

  const deleteEstimateMutation = useMutation({
    mutationFn: (estimateId) => api.estimates.deleteEstimate(estimateId),
    onSuccess: () => {
      queryClient.invalidateQueries(['estimates', jobId]);
      toast.success('Estimate deleted successfully');
    }
  });

  return {
    estimates: estimatesQuery.data || [],
    isLoading: estimatesQuery.isLoading,
    error: estimatesQuery.error,
    createEstimate: createEstimateMutation.mutate,
    updateEstimate: updateEstimateMutation.mutate,
    deleteEstimate: deleteEstimateMutation.mutate,
    isCreating: createEstimateMutation.isPending,
    isUpdating: updateEstimateMutation.isPending,
    isDeleting: deleteEstimateMutation.isPending
  };
} 