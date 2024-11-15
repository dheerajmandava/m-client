import BaseApi from './base';

class EstimatesApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/estimates');
  }

  async createEstimate(jobId, data) {
    const response = await super.post(`/jobs/${jobId}`, data);
    return response;
  }

  async fetchOne(id) {
    const response = await super.get(`/${id}`);
    return response;
  }

  async fetchJobEstimates(jobId) {
    if (!jobId) return { data: [] };
    const response = await super.get(`/jobs/${jobId}`);
    return response;
  }

  async modifyStatus(id, status, notes) {
    const response = await super.patch(`/${id}/status`, { status, notes });
    return response;
  }

  async removeEstimate(id) {
    const response = await super.delete(`/${id}`);
    return response;
  }
}

export default EstimatesApi; 