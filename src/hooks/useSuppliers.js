import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: () => api.suppliers.fetchAll(),
  });
}

export function useSupplierDetails(supplierId) {
  return useQuery({
    queryKey: ['supplier', supplierId],
    queryFn: () => api.suppliers.getOne(supplierId),
    enabled: !!supplierId
  });
}

export function useSupplierInventory(supplierId) {
  return useQuery({
    queryKey: ['supplier-inventory', supplierId],
    queryFn: () => api.suppliers.getInventory(supplierId),
    enabled: !!supplierId
  });
}

export function useSupplierOrders(supplierId) {
  return useQuery({
    queryKey: ['supplier-orders', supplierId],
    queryFn: () => api.suppliers.getOrders(supplierId),
    enabled: !!supplierId
  });
} 