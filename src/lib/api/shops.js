import BaseApi from './base';

class ShopsApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/shops');
  }

  async fetchProfile() {
    const response = await super.get('/profile');
    return response.data;
  }

  async createShop(shopData) {
    const response = await super.post('', shopData);
    return response.data;
  }

  async updateProfile(shopData) {
    const response = await super.put('/profile', shopData);
    return response.data;
  }
}

export default ShopsApi; 