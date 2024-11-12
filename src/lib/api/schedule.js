import BaseApi from './base';

class ScheduleApi extends BaseApi {
  constructor(httpClient) {
    super(httpClient, '/schedule');
  }

  async getSchedule(startDate, endDate) {
    try {
      const response = await this.client.get(`${this.endpoint}`, {
        params: { startDate, endDate }
      });
      console.log('schedule', response.data);
      return response.data;
    } catch (error) {
      return this.handleError(error, 'Failed to fetch schedule');
    }
  }

  async scheduleJob(jobId, data) {
    try {
      const response = await this.client.post(`${this.endpoint}/jobs/${jobId}`, data);
      return response.data;
    } catch (error) {
      return this.handleError(error, 'Failed to schedule job');
    }
  }

  async unscheduleJob(jobId) {
    try {
      const response = await this.client.delete(`${this.endpoint}/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      return this.handleError(error, 'Failed to unschedule job');
    }
  }

  async rescheduleJob(jobId, data) {
    try {
      const response = await this.client.put(`${this.endpoint}/jobs/${jobId}`, data);
      return response.data;
    } catch (error) {
      return this.handleError(error, 'Failed to reschedule job');
    }
  }

  async getMechanicSchedule(mechanicId, startDate, endDate) {
    try {
      const response = await this.client.get(`${this.endpoint}/mechanics/${mechanicId}`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      return this.handleError(error, 'Failed to fetch mechanic schedule');
    }
  }

  async updateSchedule(jobId, scheduleData) {
    try {
      const formattedData = {
        scheduledDate: scheduleData.scheduledDate instanceof Date 
          ? scheduleData.scheduledDate.toISOString().split('T')[0]
          : scheduleData.scheduledDate,
        scheduledTime: scheduleData.scheduledTime,
        mechanicId: scheduleData.mechanicId,
        estimatedHours: typeof scheduleData.estimatedHours === 'string' 
          ? parseFloat(scheduleData.estimatedHours) 
          : scheduleData.estimatedHours
      };

      const response = await this.client.put(`${this.endpoint}/${jobId}`, formattedData);
      return response.data;
    } catch (error) {
      return this.handleError(error, 'Failed to update schedule');
    }
  }
}

export default ScheduleApi; 