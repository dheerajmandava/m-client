import BaseApi from './base';

class PartOrdersApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/part-orders');
  }

  async fetchAll() {
    const response = await super.get();
    return response.data;
  }

  async fetchOne(id) {
    const response = await super.get(`/${id}`);
    return response.data;
  }

  async createOrder(orderData) {
    const response = await super.post('', orderData);
    return response.data;
  }

  async updateOrder(id, orderData) {
    const response = await super.put(`/${id}`, orderData);
    return response.data;
  }

  async modifyStatus(id, status) {
    const response = await super.patch(`/${id}/status`, { status });
    return response.data;
  }

  async removeOrder(id) {
    const response = await super.delete(`/${id}`);
    return response.data;
  }

  async fetchOrderItems(id) {
    const response = await super.get(`/${id}/items`);
    return response.data;
  }

  async addOrderItem(id, itemData) {
    const response = await super.post(`/${id}/items`, itemData);
    return response.data;
  }

  async updateOrderItem(orderId, itemId, itemData) {
    const response = await super.put(`/${orderId}/items/${itemId}`, itemData);
    return response.data;
  }

  async removeOrderItem(orderId, itemId) {
    const response = await super.delete(`/${orderId}/items/${itemId}`);
    return response.data;
  }
}

export default PartOrdersApi; 