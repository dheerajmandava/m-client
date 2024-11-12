import BaseApi from './base';

class MechanicsApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/mechanics');
  }

  async getAll() {
    try {
      const response = await this.client.get(this.endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch mechanics');
    }
  }

  async create(data) {
    try {
      const response = await this.client.post(this.endpoint, {
        ...data,
        specialties: Array.isArray(data.specialties) ? data.specialties : [data.specialties]
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create mechanic');
    }
  }

  async update(id, data) {
    try {
      const response = await this.client.put(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update mechanic');
    }
  }

  async get(id) {
    try {
      const response = await this.client.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch mechanic');
    }
  }

  async delete(id) {
    try {
      const response = await this.client.delete(`${this.endpoint}/${id}`);
      return { success: true, message: 'Mechanic deleted successfully' };
    } catch (error) {
      return this.handleError(error, 'Failed to delete mechanic');
    }
  }
}

export default MechanicsApi; 