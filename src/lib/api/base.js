import { ApiHandler } from '../utils/apiHandler';

class BaseApi {
  constructor(httpClient, endpoint) {
    this.client = httpClient.client;
    this.endpoint = endpoint;
  }

  async request(method, path = '', data = null, params = null) {
    const fullUrl = path ? `${this.endpoint}${path}` : this.endpoint;
    
    // Log API call details
    console.log(`🚀 API Call:`, {
      method,
      endpoint: fullUrl,
      data: data || 'No data',
      params: params || 'No params'
    });

    const config = {
      method,
      url: fullUrl,
      ...(data && { data }),
      ...(params && { params })
    };

    try {
      const response = await ApiHandler.makeRequest(
        this.client(config),
        `Failed to ${method.toLowerCase()} ${this.endpoint}`
      );
      
      // Log successful response
      console.log(`✅ API Response:`, {
        endpoint: fullUrl,
        status: response.status,
        data: response.data
      });

      return response;
    } catch (error) {
      // Log error
      console.error(`❌ API Error:`, {
        endpoint: fullUrl,
        error: error.message,
        details: error.response?.data
      });
      throw error;
    }
  }

  get(path = '', params = null) {
    return this.request('GET', path, null, params);
  }

  post(path = '', data = null) {
    return this.request('POST', path, data);
  }

  put(path = '', data = null) {
    return this.request('PUT', path, data);
  }

  patch(path = '', data = null) {
    return this.request('PATCH', path, data);
  }

  delete(path = '') {
    return this.request('DELETE', path);
  }
}

export default BaseApi; 