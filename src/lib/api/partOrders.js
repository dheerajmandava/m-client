import BaseApi from './base';

class PartOrdersApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/part-orders');
  }

  async getAll() {
    try {
      const response = await this.client.get(this.endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch part orders');
    }
  }

  async get(id) {
    try {
      const response = await this.client.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch part order');
    }
  }

  async create(data) {
    try {
      const response = await this.client.post(this.endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create part order');
    }
  }

  async update(id, data) {
    try {
      const response = await this.client.put(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update part order');
    }
  }

  async updateStatus(id, status) {
    try {
      const response = await this.client.patch(`${this.endpoint}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update part order status');
    }
  }

  async delete(id) {
    try {
      const response = await this.client.delete(`${this.endpoint}/${id}`);
      return { success: true, message: 'Part order deleted successfully' };
    } catch (error) {
      return this.handleError(error, 'Failed to delete part order');
    }
  }
}

export default PartOrdersApi; 