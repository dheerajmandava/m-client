import BaseApi from './base';

class ShopsApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/shops');
  }

  async fetchProfile() {
    try {
      const response = await super.get('/profile');
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Shop profile fetch error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch shop profile',
        status: error.response?.status
      };
    }
  }

  async createShop(shopData) {
    try {
      const response = await super.post('', shopData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Shop creation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create shop',
        status: error.response?.status
      };
    }
  }

  async updateProfile(shopData) {
    try {
      const response = await super.put('/profile', shopData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Shop update error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update shop profile',
        status: error.response?.status
      };
    }
  }
}

export default ShopsApi; 