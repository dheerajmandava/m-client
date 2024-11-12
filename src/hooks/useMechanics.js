import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export function useMechanics() {
  const queryClient = useQueryClient();

  const mechanicsQuery = useQuery({
    queryKey: ['mechanics'],
    queryFn: () => api.mechanics.fetchAll()
  });

  const createMechanicMutation = useMutation({
    mutationFn: (data) => api.mechanics.createMechanic(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['mechanics']);
      toast.success('Mechanic created successfully');
    }
  });

  const updateMechanicMutation = useMutation({
    mutationFn: ({ id, data }) => api.mechanics.updateMechanic(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['mechanics']);
      toast.success('Mechanic updated successfully');
    }
  });

  return {
    mechanics: mechanicsQuery.data || [],
    isLoading: mechanicsQuery.isLoading,
    error: mechanicsQuery.error,
    createMechanic: createMechanicMutation.mutate,
    updateMechanic: updateMechanicMutation.mutate,
    isCreating: createMechanicMutation.isPending,
    isUpdating: updateMechanicMutation.isPending
  };
} 