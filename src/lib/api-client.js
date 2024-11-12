import httpClient from './axiosClient';

class ApiClient {
  constructor() {
    if (ApiClient.instance) {
      return ApiClient.instance;
    }
    
    this.endpoints = {
      mechanics: '/mechanics',
      jobs: '/jobs',
      estimates: '/estimates',
      inventory: '/inventory',
      shops: '/shops'
    };

    ApiClient.instance = this;
  }

  // Generic error handler
  handleError(error, defaultMessage) {
    console.error(error);
    return {
      success: false,
      message: error.message || defaultMessage,
      error: error.response?.data?.error || error
    };
  }

  // Response formatter
  formatResponse(response, defaultData = null) {
    return {
      success: response.success,
      data: response.data || defaultData,
      message: response.message
    };
  }

  // Data formatters
  formatDate(date) {
    return date instanceof Date ? date.toISOString() : date;
  }

  formatNumber(value) {
    return value ? Number(value) : null;
  }
}

// Create and freeze the singleton instance
const apiClient = Object.freeze(new ApiClient());
export default apiClient; 