import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        if (isLoaded && isSignedIn) {
          const response = await api.shops.fetchProfile();
          setShop(response);
        }
      } catch (error) {
        console.error('Failed to fetch shop data:', error);
        toast.error('Failed to load shop details');
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [isLoaded, isSignedIn]);

  // Don't attempt to fetch if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setShop(null);
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

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