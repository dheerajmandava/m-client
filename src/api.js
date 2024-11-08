import { useAuth } from '@clerk/nextjs';

const api = {
  async getShopProfile() {
    const { getToken } = useAuth();
    const token = await getToken();

    const response = await fetch('http://localhost:5000/api/shops/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },

  async createShop(shopData) {
    const { getToken } = useAuth();
    const token = await getToken();

    const response = await fetch('http://localhost:5000/api/shops', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(shopData)
    });
    return response.json();
  }
};

export default api; 