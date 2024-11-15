import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api/index';

export function useEstimates(jobId) {
  const queryClient = useQueryClient();

  const estimatesQuery = useQuery({
    queryKey: ['estimates', jobId],
    queryFn: () => api.estimates.fetchJobEstimates(jobId),
    enabled: Boolean(jobId),
    staleTime: 30000,
    retry: 1,
  });

  const createEstimateMutation = useMutation({
    mutationFn: (data) => api.estimates.createEstimate(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['estimates', jobId]);
      toast.success('Estimate created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create estimate');
    }
  });

  const updateEstimateMutation = useMutation({
    mutationFn: ({ estimateId, data }) => api.estimates.updateEstimate(estimateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['estimates', jobId]);
      toast.success('Estimate updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update estimate');
    }
  });

  const deleteEstimateMutation = useMutation({
    mutationFn: (estimateId) => api.estimates.removeEstimate(estimateId),
    onSuccess: () => {
      queryClient.invalidateQueries(['estimates', jobId]);
      toast.success('Estimate deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete estimate');
    }
  });

  return {
    estimates: estimatesQuery.data?.data || [],
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