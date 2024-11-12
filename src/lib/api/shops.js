import BaseApi from './base';

class ShopsApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/shops');
  }

  async getProfile() {
    try {
      const response = await this.client.get(`${this.endpoint}/profile`);
      return response;
    } catch (error) {
      return this.handleError(error, 'Failed to fetch shop profile');
    }
  }

  async create(data) {
    try {
      const response = await this.client.post(this.endpoint, data);
      return response;
    } catch (error) {
      return this.handleError(error, 'Failed to create shop');
    }
  }

  async update(data) {
    try {
      const response = await this.client.put(`${this.endpoint}/profile`, data);
      return response;
    } catch (error) {
      return this.handleError(error, 'Failed to update shop');
    }
  }
}

export default ShopsApi; 