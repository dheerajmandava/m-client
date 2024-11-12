import BaseApi from './base';

class EstimatesApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/estimates');
  }

  async create(jobId, estimateData) {
    try {
      const response = await this.client.post(`/jobs/${jobId}/estimates`, estimateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create estimate');
    }
  }

  async get(id) {
    try {
      const response = await this.client.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch estimate');
    }
  }

  async getJobEstimates(jobId) {
    try {
      const response = await this.client.get(`/jobs/${jobId}/estimates`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch estimates');
    }
  }

  async updateStatus(id, status, notes) {
    try {
      const response = await this.client.patch(`${this.endpoint}/${id}/status`, { status, notes });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update estimate status');
    }
  }

  async delete(id) {
    try {
      const response = await this.client.delete(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to delete estimate');
    }
  }
}

export default EstimatesApi; 