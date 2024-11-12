import BaseApi from './base';

class ScheduleApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/schedule');
  }

  async fetchSchedule(startDate, endDate) {
    const response = await super.get('', { startDate, endDate });
    return response.data;
  }

  async assignJob(jobId, scheduleData) {
    const response = await super.post(`/${jobId}`, scheduleData);
    return response.data;
  }

  async removeJobSchedule(jobId) {
    const response = await super.delete(`/${jobId}`);
    return response.data;
  }

  async modifyJobSchedule(jobId, scheduleData) {
    const response = await super.put(`/${jobId}`, scheduleData);
    return response.data;
  }

  async fetchMechanicSchedule(mechanicId, startDate, endDate) {
    const response = await super.get(`/mechanics/${mechanicId}`, { startDate, endDate });
    return response.data;
  }
}

export default ScheduleApi; 