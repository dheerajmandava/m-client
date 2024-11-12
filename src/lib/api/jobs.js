import BaseApi from './base';

class JobsApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/jobs');
  }

  async getAll() {
    try {
      const response = await this.client.get(this.endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch jobs');
    }
  }

  async get(id) {
    try {
      const response = await this.client.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch job');
    }
  }

  async create(data) {
    try {
      const formattedData = {
        ...data,
        mileage: data.mileage?.toString(),
        vehicleYear: data.vehicleYear?.toString(),
        estimatedCost: parseFloat(data.estimatedCost || 0)
      };
      const response = await this.client.post(this.endpoint, formattedData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to create job');
    }
  }

  async update(id, data) {
    try {
      const response = await this.client.put(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update job');
    }
  }

  async updateStatus(jobId, data) {
    try {
      const response = await this.client.put(`${this.endpoint}/${jobId}/status`, {
        status: data.status,
        notes: data.notes
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update job status');
    }
  }

  async addNote(jobId, note) {
    try {
      const response = await this.client.post(`${this.endpoint}/${jobId}/notes`, { note });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to add note');
    }
  }

  async addPart(jobId, partData) {
    try {
      const response = await this.client.post(`${this.endpoint}/${jobId}/parts`, partData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to add part');
    }
  }

  async returnPart(jobId, partId, reason) {
    try {
      const response = await this.client.post(`${this.endpoint}/${jobId}/parts/${partId}/return`, { reason });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to return part');
    }
  }

  async removePart(jobId, partId) {
    try {
      const response = await this.client.delete(`${this.endpoint}/${jobId}/parts/${partId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to remove part');
    }
  }
}

export default JobsApi; 