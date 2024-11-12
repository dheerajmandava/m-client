class BaseApi {
  constructor(httpClient, endpoint) {
    this.client = httpClient;
    this.endpoint = `${endpoint}`;
  }

  handleError(error, defaultMessage) {
    if (error.message === 'Network Error') {
      return {
        success: false,
        message: 'Unable to connect to server',
        error: { code: 'NETWORK_ERROR' }
      };
    }
    return {
      success: false,
      message: error.response?.data?.message || defaultMessage,
      error: error.response?.data?.error || error.message
    };
  }
}

export default BaseApi; 