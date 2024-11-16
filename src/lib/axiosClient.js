import axios from 'axios';
import { toast } from 'sonner';

class HttpClient {
  constructor() {
    if (HttpClient.instance) {
      return HttpClient.instance;
    }

    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
    HttpClient.instance = this;
  }

  setupInterceptors() {
    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, token = null) => {
      failedQueue.forEach(prom => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve(token);
        }
      });
      failedQueue = [];
    };

    this.client.interceptors.request.use(
      async (config) => {
        if (!isRefreshing) {
          try {
            const response = await fetch('/api/auth/token');
            const data = await response.json();
            
            if (data.error) {
              throw new Error(data.error);
            }
            
            if (data.token) {
              config.headers.Authorization = `Bearer ${data.token}`;
            }
          } catch (error) {
            console.error('Token fetch error:', error);
            if (window.location.pathname !== '/sign-in') {
              window.location.href = '/sign-in';
            }
            return Promise.reject(error);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response) {
          toast.error('Network error. Please check your connection.');
          return Promise.reject({
            message: 'Network Error',
            code: 'NETWORK_ERROR'
          });
        }

        switch (error.response.status) {
          case 401:
            window.location.href = '/sign-in';
            break;
          case 403:
            toast.error('You do not have permission to perform this action');
            break;
          case 404:
            if (error.response?.data?.error?.code === 'NO_SHOP_PROFILE') {
              window.location.href = '/setup-shop';
            }
            break;
          case 500:
            toast.error('An unexpected error occurred');
            break;
        }

        return Promise.reject(error);
      }
    );
  }

  async request(method, url, data = null, options = {}) {
    try {
      const response = await this.client.request({
        method,
        url,
        data,
        ...options
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred',
        error: error.response?.data?.error || error.message
      };
    }
  }

  get(url, options = {}) {
    return this.request('GET', url, null, options);
  }

  post(url, data, options = {}) {
    return this.request('POST', url, data, options);
  }

  put(url, data, options = {}) {
    return this.request('PUT', url, data, options);
  }

  delete(url, options = {}) {
    return this.request('DELETE', url, null, options);
  }
}

// Create and freeze the singleton instance
const httpClient = Object.freeze(new HttpClient());
export default httpClient; 