import axiosClient from './axiosClient';

export const api = {
  async getMechanics() {
    try {
      const response = await axiosClient.get('/mechanics');
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error) {
      console.error('Get mechanics error:', error.response?.data || error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch mechanics',
        error: error.response?.data?.error || error.message
      };
    }
  },

  async createMechanic(mechanicData) {
    try {
      const response = await axiosClient.post('/mechanics', {
        ...mechanicData,
        specialties: Array.isArray(mechanicData.specialties) 
          ? mechanicData.specialties 
          : [mechanicData.specialties]
      });
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Create mechanic error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create mechanic',
        error: error.message
      };
    }
  },

  async updateMechanic(id, mechanicData) {
    try {
      const response = await axiosClient.put(`/mechanics/${id}`, mechanicData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update mechanic',
        error: error.message
      };
    }
  },

  async getJobCards() {
    try {
      const response = await axiosClient.get('/job-cards');
      return {
        success: true,
        data: response.data.data || [],
        message: 'Jobs retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching job cards:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch jobs'
      };
    }
  },

  async getJobCard(id) {
    try {
      const response = await axiosClient.get(`/job-cards/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Get job card error:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch job details',
        error: error.response?.data?.error || error.message
      };
    }
  },

  async createJobCard(jobData) {
    try {
      console.log('Creating job card with data:', jobData);
      
      const formattedData = {
        ...jobData,
        mileage: jobData.mileage ? jobData.mileage.toString() : null,
        vehicleYear: jobData.vehicleYear?.toString() || null,
        estimatedCost: parseFloat(jobData.estimatedCost || 0)
      };

      console.log('Formatted job data:', formattedData);
      
      const response = await axiosClient.post('/job-cards', formattedData);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Create job card error:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create job card',
        error: error.response?.data?.error || error.message
      };
    }
  },

  async getSchedules(date) {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await axiosClient.get(`/schedule?date=${formattedDate}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch schedules',
        error: error.message
      };
    }
  },

  async scheduleJob(jobId, scheduleData) {
    try {
      const response = await axiosClient.post('/schedule', {
        jobId,
        ...scheduleData,
        scheduledDate: scheduleData.scheduledDate.toISOString()
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Schedule job error:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to schedule job',
        error: error.response?.data?.error || error.message
      };
    }
  },

  async getShopProfile() {
    try {
      const response = await axiosClient.get('/shops/profile');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch shop profile',
        error: error.message
      };
    }
  },

  async createShopProfile(shopData) {
    try {
      const response = await axiosClient.post('/shops', shopData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create shop profile',
        error: error.message
      };
    }
  },

  async updateShopProfile(shopData) {
    try {
      const response = await axiosClient.put('/shops/profile', shopData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update shop profile',
        error: error.message
      };
    }
  },

  async getUnscheduledJobs() {
    try {
      const response = await axiosClient.get('/jobs/unscheduled');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch unscheduled jobs',
        error: error.message
      };
    }
  },

  async getScheduledJobs({ date } = {}) {
    try {
      const url = date 
        ? `/job-cards/scheduled?date=${date}`
        : '/job-cards/scheduled';
      
      const response = await axiosClient.get(url);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return {
        success: true,
        data: response.data.data || [],
        message: 'Scheduled jobs retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching scheduled jobs:', error.response?.data || error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch scheduled jobs',
        error: error.response?.data?.error || error.message
      };
    }
  },

  async getJobsByDate(date) {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await axiosClient.get(`/job-cards/by-date/${formattedDate}`);
      return {
        success: true,
        data: response.data.data || [],
        message: 'Jobs for date retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching jobs by date:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Failed to fetch jobs for date',
        error: error.message
      };
    }
  },

  async getMechanic(id) {
    try {
      const response = await axiosClient.get(`/mechanics/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Get mechanic error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch mechanic'
      };
    }
  },

  async updateJobStatus(jobId, status, notes) {
    try {
      const response = await axiosClient.patch(`/job-cards/${jobId}/status`, {
        status,
        notes
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Update job status error:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update job status',
        error: error.response?.data?.error || error.message
      };
    }
  },

  async addJobNote(jobId, note) {
    try {
      const response = await axiosClient.post(`/job-cards/${jobId}/notes`, { note });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Add job note error:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add note',
        error: error.response?.data?.error || error.message
      };
    }
  },

  async updateJobCard(id, jobData) {
    try {
      const formattedData = {
        ...jobData,
        mileage: jobData.mileage ? jobData.mileage.toString() : null,
        vehicleYear: jobData.vehicleYear?.toString() || null,
        estimatedCost: parseFloat(jobData.estimatedCost || 0)
      };

      const response = await axiosClient.put(`/job-cards/${id}`, formattedData);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      
      return {
        success: true,
        data: response.data.data,
        message: 'Job updated successfully'
      };
    } catch (error) {
      console.error('Update job error:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update job',
        error: error.response?.data?.error || error.message
      };
    }
  },

  async deleteJobCard(id) {
    try {
      const response = await axiosClient.delete(`/job-cards/${id}`);
     
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      
      return {
        success: true,
        message: 'Job deleted successfully'
      };
    } catch (error) {
      console.error('Delete job error:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete job',
        error: error.response?.data?.error || error.message
      };
    }
  },

  async updateJobSchedule(jobId, scheduleData) {
    try {
      const formattedData = {
        ...scheduleData,
        scheduledDate: scheduleData.scheduledDate.toISOString(),
        mechanicId: scheduleData.mechanicId,
        estimatedHours: parseFloat(scheduleData.estimatedHours)
      };

      const response = await axiosClient.put(`/schedule/${jobId}`, formattedData);
      
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      
      return {
        success: true,
        data: response.data.data,
        message: 'Schedule updated successfully'
      };
    } catch (error) {
      console.error('Update schedule error:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update schedule',
        error: error.response?.data?.error || error.message
      };
    }
  },

  async addPartToJob(jobId, partData) {
    try {
      const response = await axiosClient.post(`/job-cards/${jobId}/parts`, partData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add part'
      };
    }
  },

  async addJobCost(jobId, costData) {
    try {
      const response = await axiosClient.post(`/job-cards/${jobId}/costs`, costData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add cost'
      };
    }
  },

  async getInventory() {
    try {
      const response = await axiosClient.get('/inventory');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch inventory'
      };
    }
  },

  async getLowStockItems() {
    try {
      const response = await axiosClient.get('/inventory/low-stock');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch low stock items'
      };
    }
  },

  async addInventoryItem(itemData) {
    try {
      const response = await axiosClient.post('/inventory', itemData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add inventory item'
      };
    }
  },

  async updateInventoryItem(id, itemData) {
    try {
      const response = await axiosClient.put(`/inventory/${id}`, itemData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update inventory item'
      };
    }
  },

  async deleteInventoryItem(id) {
    try {
      const response = await axiosClient.delete(`/inventory/${id}`);
      return {
        success: true,
        message: 'Item deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete inventory item'
      };
    }
  },

  async getPartOrders() {
    try {
      const response = await axiosClient.get('/part-orders');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch orders'
      };
    }
  },

  async createPartOrder(orderData) {
    try {
      const response = await axiosClient.post('/part-orders', orderData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create order'
      };
    }
  },

  async getSuppliers() {
    try {
      const response = await axiosClient.get('/suppliers');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch suppliers'
      };
    }
  },

  async createSupplier(data) {
    try {
      const response = await axiosClient.post('/suppliers', data);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create supplier'
      };
    }
  },

  async updateSupplier(id, data) {
    try {
      const response = await axiosClient.put(`/suppliers/${id}`, data);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update supplier'
      };
    }
  },

  async getSupplierOrders(supplierId) {
    try {
      const response = await axiosClient.get(`/suppliers/${supplierId}/orders`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch supplier orders'
      };
    }
  },

  async getSupplierInventory(supplierId) {
    try {
      const response = await axiosClient.get(`/suppliers/${supplierId}/inventory`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch supplier inventory'
      };
    }
  },

  async getPartOrderById(id) {
    try {
      const response = await axiosClient.get(`/part-orders/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch order details'
      };
    }
  },

  async updateOrderStatus(id, status) {
    try {
      const response = await axiosClient.put(`/part-orders/${id}/status`, { status });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update order status'
      };
    }
  },

  async getInventoryReports(timeframe) {
    try {
      const response = await axiosClient.get(`/inventory/reports?timeframe=${timeframe}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch reports'
      };
    }
  },

  async exportInventoryReport(timeframe) {
    try {
      const response = await axiosClient.get(`/inventory/export?timeframe=${timeframe}`, {
        responseType: 'blob'
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to export report'
      };
    }
  },

  async createStockAdjustment(data) {
    try {
      const response = await axiosClient.post('/stock-adjustments', data);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create stock adjustment'
      };
    }
  },

  async getStockAdjustments({ inventoryId, startDate, endDate } = {}) {
    try {
      const params = new URLSearchParams();
      if (inventoryId) params.append('inventoryId', inventoryId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axiosClient.get(`/stock-adjustments?${params}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch stock adjustments'
      };
    }
  },

  async getInventoryValueHistory(timeframe) {
    try {
      const response = await axiosClient.get(`/inventory/value-history?timeframe=${timeframe}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch value history'
      };
    }
  },

  async getInventoryAnalytics() {
    try {
      const response = await axiosClient.get('/inventory/analytics');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch analytics'
      };
    }
  },

  getInventorySettings: async () => {
    const response = await axiosClient.get('/api/inventory/settings');
    if (!response.ok) throw new Error('Failed to fetch inventory settings');
    return response.json();
  },

  async getJobParts(jobId) {
    try {
      const response = await axiosClient.get(`/job-cards/${jobId}/parts`);
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to fetch parts');
      }
      return response.data.data; // Returns { parts, totalCost }
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to fetch parts';
    }
  },

  async installJobPart(jobId, partId) {
    try {
      const response = await axiosClient.post(`/job-cards/${jobId}/parts/${partId}/install`);
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to install part');
      }
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to install part';
    }
  },

  async returnJobPart(jobId, partId, reason) {
    try {
      const response = await axiosClient.post(`/job-cards/${jobId}/parts/${partId}/return`, { reason });
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to return part');
      }
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || error.message || 'Failed to return part';
    }
  },

  async removeJobPart(jobId, partId) {
    try {
      const response = await axiosClient.delete(`/job-cards/${jobId}/parts/${partId}`);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove part'
      };
    }
  }
};