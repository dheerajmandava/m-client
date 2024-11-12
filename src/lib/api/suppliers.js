import BaseApi from './base';

class SuppliersApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/suppliers');
  }

  async getAll() {
    try {
      const response = await this.client.get(this.endpoint);
      return response;
    } catch (error) {
      return this.handleError(error, 'Failed to fetch suppliers');
    }
  }

  async get(id) {
    try {
      const response = await this.client.get(`${this.endpoint}/${id}`);
      return response;
    } catch (error) {
      return this.handleError(error, 'Failed to fetch supplier');
    }
  }

  async create(data) {
    try {
      const response = await this.client.post(this.endpoint, data);
      return response;
    } catch (error) {
      return this.handleError(error, 'Failed to create supplier');
    }
  }

  async update(id, data) {
    try {
      const response = await this.client.put(`${this.endpoint}/${id}`, data);
      return response;
    } catch (error) {
      return this.handleError(error, 'Failed to update supplier');
    }
  }

  async delete(id) {
    try {
      const response = await this.client.delete(`${this.endpoint}/${id}`);
      return { success: true, message: 'Supplier deleted successfully' };
    } catch (error) {
      return this.handleError(error, 'Failed to delete supplier');
    }
  }

  async getOrders(id) {
    try {
      const response = await this.client.get(`${this.endpoint}/${id}/orders`);
      return response;
    } catch (error) {
      return this.handleError(error, 'Failed to fetch supplier orders');
    }
  }

  async createOrder(id, data) {
    try {
      const response = await this.client.post(`${this.endpoint}/${id}/orders`, data);
      return response;
    } catch (error) {
      return this.handleError(error, 'Failed to create supplier order');
    }
  }
}

export default SuppliersApi; 