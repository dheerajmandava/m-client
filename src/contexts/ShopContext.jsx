import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await api.shops.fetchProfile();
        setShop(response);
      } catch (error) {
        console.error('Failed to fetch shop data:', error);
        toast.error('Failed to load shop details');
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  return (
    <ShopContext.Provider value={{ shop, setShop, loading }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
} 