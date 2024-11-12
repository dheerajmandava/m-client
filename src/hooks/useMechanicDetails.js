import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export function useMechanicDetails(mechanicId) {
  const queryClient = useQueryClient();

  const mechanicQuery = useQuery({
    queryKey: ['mechanic', mechanicId],
    queryFn: () => api.mechanics.fetchOne(mechanicId),
    enabled: !!mechanicId
  });

  const updateMechanicMutation = useMutation({
    mutationFn: (data) => api.mechanics.updateMechanic(mechanicId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['mechanic', mechanicId]);
      toast.success('Mechanic updated successfully');
    }
  });

  const removeMechanicMutation = useMutation({
    mutationFn: () => api.mechanics.removeMechanic(mechanicId),
    onSuccess: () => {
      queryClient.invalidateQueries(['mechanics']);
      toast.success('Mechanic removed successfully');
    }
  });

  return {
    mechanic: mechanicQuery.data,
    isLoading: mechanicQuery.isLoading,
    error: mechanicQuery.error,
    updateMechanic: updateMechanicMutation.mutate,
    removeMechanic: removeMechanicMutation.mutate,
    isUpdating: updateMechanicMutation.isPending,
    isRemoving: removeMechanicMutation.isPending
  };
} 