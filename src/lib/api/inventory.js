import BaseApi from './base';

class InventoryApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/inventory');
  }

  async fetchAll() {
    const response = await super.get();
    return response.data;
  }

  async fetchOne(id) {
    const response = await super.get(`/${id}`);
    return response.data;
  }

  async createItem(data) {
    const response = await super.post('', data);
    return response.data;
  }

  async updateItem(id, data) {
    const response = await super.put(`/${id}`, data);
    return response.data;
  }

  async removeItem(id) {
    const response = await super.delete(`/${id}`);
    return response.data;
  }

  async adjustItemStock(id, adjustmentData) {
    const response = await super.post(`/${id}/adjust`, adjustmentData);
    return response.data;
  }

  async fetchStockHistory(id) {
    const response = await super.get(`/${id}/history`);
    return response.data;
  }

  async fetchLowStock() {
    const response = await super.get('/low-stock');
    return response.data;
  }

  async searchItems(query) {
    const response = await super.get('/search', { q: query });
    return response.data;
  }
}

export default InventoryApi; 