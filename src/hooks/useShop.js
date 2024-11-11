import { useContext } from 'react';
import { ShopContext } from '@/contexts/ShopContext';

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
} 