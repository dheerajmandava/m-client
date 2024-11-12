import BaseApi from './base';

class SuppliersApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/suppliers');
  }

  async fetchAll() {
    const response = await super.get();
    return response.data || [];
  }

  async fetchOne(id) {
    const response = await super.get(`/${id}`);
    return response.data;
  }

  async createSupplier(data) {
    const response = await super.post('', data);
    return response.data;
  }

  async updateSupplier(id, data) {
    const response = await super.put(`/${id}`, data);
    return response.data;
  }

  async removeSupplier(id) {
    const response = await super.delete(`/${id}`);
    return response.data;
  }

  async fetchSupplierOrders(id) {
    const response = await super.get(`/${id}/orders`);
    return response.data;
  }

  async createSupplierOrder(id, orderData) {
    const response = await super.post(`/${id}/orders`, orderData);
    return response.data;
  }
}

export default SuppliersApi; 