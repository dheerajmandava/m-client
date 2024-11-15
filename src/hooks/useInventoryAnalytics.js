import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useInventory } from './useInventory';

export function useInventoryAnalytics() {
  const { data: inventory, isLoading } = useInventory();

  const analytics = {
    totalItems: inventory?.length || 0,
    lowStockItems: inventory?.filter(item => 
      item.quantity <= (item.minQuantity || 0)
    ).length || 0,
    outOfStockItems: inventory?.filter(item => 
      item.quantity === 0
    ).length || 0,
    totalValue: inventory?.reduce((sum, item) => 
      sum + (item.quantity * item.costPrice), 0
    ) || 0
  };

  return { data: analytics, isLoading };
} 