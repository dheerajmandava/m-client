import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useInventory() {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: () => api.inventory.fetchAll(),
  });
} 