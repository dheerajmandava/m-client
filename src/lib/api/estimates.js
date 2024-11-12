import BaseApi from './base';

class EstimatesApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/estimates');
  }

  async createEstimate(jobId, estimateData) {
    const response = await super.post(`/jobs/${jobId}/estimates`, estimateData);
    return response.data;
  }

  async fetchOne(id) {
    const response = await super.get(`/${id}`);
    return response.data;
  }

  async fetchJobEstimates(jobId) {
    const response = await super.get(`/jobs/${jobId}/estimates`);
    return response.data;
  }

  async modifyStatus(id, status, notes) {
    const response = await super.patch(`/${id}/status`, { status, notes });
    return response.data;
  }

  async removeEstimate(id) {
    const response = await super.delete(`/${id}`);
    return response.data;
  }
}

export default EstimatesApi; 