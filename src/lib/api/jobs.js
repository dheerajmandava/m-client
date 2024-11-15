import BaseApi from './base';

class JobsApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/jobs');
  }

  async fetchAll() {
    console.log('JobsApi.fetchAll() called');
    try {
      const response = await super.get();
      console.log('JobsApi.fetchAll() response:', response);
      return response.data;
    } catch (error) {
      console.error('JobsApi.fetchAll() error:', error);
      throw error;
    }
  }

  async fetchOne(id) {
    const response = await super.get(`/${id}`);
    return response.data;
  }

  async create(data) {
    const formattedData = {
      ...data,
      mileage: data.mileage?.toString(),
      vehicleYear: data.vehicleYear?.toString(),
      estimatedCost: parseFloat(data.estimatedCost || 0)
    };
    const response = await super.post('', formattedData);
    return response;
  }

  async updateJob(id, data) {
    const response = await super.put(`/${id}`, data);
    return response.data;
  }

  async updateJobStatus(jobId, data) {
    const response = await super.put(`/${jobId}/status`, {
      status: data.status,
      notes: data.notes
    });
    return response.data;
  }

  async fetchParts(jobId) {
    const response = await super.get(`/${jobId}/parts`);
    return response.data;
  }

  async addJobPart(jobId, partData) {
    const response = await super.post(`/${jobId}/parts`, partData);
    return response.data;
  }

  async installJobPart(jobId, partId) {
    const response = await super.post(`/${jobId}/parts/${partId}/install`);
    return response.data;
  }

  async returnJobPart(jobId, partId, reason) {
    const response = await super.post(`/${jobId}/parts/${partId}/return`, { reason });
    return response.data;
  }

  async removeJobPart(jobId, partId) {
    const response = await super.delete(`/${jobId}/parts/${partId}`);
    return response.data;
  }
}

export default JobsApi; 