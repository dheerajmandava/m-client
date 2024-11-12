import BaseApi from './base';

class InventoryApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/inventory');
  }

  async getAll() {
    try {
      const response = await this.client.get(this.endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch inventory');
    }
  }

  async get(id) {
    try {
      const response = await this.client.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch inventory item');
    }
  }

  async create(data) {
    try {
      const response = await this.client.post(this.endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create inventory item');
    }
  }

  async update(id, data) {
    try {
      const response = await this.client.put(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update inventory item');
    }
  }

  async delete(id) {
    try {
      const response = await this.client.delete(`${this.endpoint}/${id}`);
      return { success: true, message: 'Inventory item deleted successfully' };
    } catch (error) {
      return this.handleError(error, 'Failed to delete inventory item');
    }
  }

  async adjustStock(id, data) {
    try {
      const response = await this.client.post(`${this.endpoint}/${id}/adjust`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to adjust stock');
    }
  }

  async getStockHistory(id) {
    try {
      const response = await this.client.get(`${this.endpoint}/${id}/history`);
      return response.data;
    } catch (error) {
      return this.handleError(error, 'Failed to fetch stock history');
    }
  }

  async getLowStock() {
    try {
      const response = await this.client.get(`${this.endpoint}/low-stock`);
      return response.data;
    } catch (error) {
      return this.handleError(error, 'Failed to fetch low stock items');
    }
  }

  async search(query) {
    try {
      const response = await this.client.get(`${this.endpoint}/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to search inventory');
    }
  }
}

export default InventoryApi; 