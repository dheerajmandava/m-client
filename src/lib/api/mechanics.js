import BaseApi from './base';

class MechanicsApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/mechanics');
  }

  async fetchAll() {
    const response = await super.get();
    return response.data;
  }

  async fetchOne(id) {
    const response = await super.get(`/${id}`);
    return response.data;
  }

  async createMechanic(data) {
    const formattedData = {
      ...data,
      specialties: Array.isArray(data.specialties) ? data.specialties : [data.specialties]
    };
    const response = await super.post('', formattedData);
    return response.data;
  }

  async updateMechanic(id, data) {
    const response = await super.put(`/${id}`, data);
    return response.data;
  }

  async removeMechanic(id) {
    const response = await super.delete(`/${id}`);
    return response.data;
  }
}

export default MechanicsApi; 