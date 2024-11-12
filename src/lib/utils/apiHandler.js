import { toast } from 'sonner';
import { ResponseStatus, ErrorMessages, StatusCodes } from './apiResponse';

export class ApiHandler {
  static processResponse(response) {
    const { success, data, message, error } = response?.data || {};

    if (!success) {
      this.handleError(response.status, message, error);
    }

    return {
      data,
      message,
      status: response.status
    };
  }

  static handleError(status, message, error) {
    let errorType;
    
    switch (status) {
      case StatusCodes.UNAUTHORIZED:
        errorType = ResponseStatus.AUTH_ERROR;
        break;
      case StatusCodes.VALIDATION_ERROR:
        errorType = ResponseStatus.VALIDATION_ERROR;
        break;
      case StatusCodes.NOT_FOUND:
        errorType = ResponseStatus.NOT_FOUND;
        break;
      case StatusCodes.SERVER_ERROR:
        errorType = ResponseStatus.SERVER_ERROR;
        break;
      default:
        errorType = ResponseStatus.ERROR;
    }

    const errorMessage = message || ErrorMessages[errorType] || ErrorMessages.DEFAULT;
    
    toast.error(errorMessage);
    throw new ApiError(errorType, errorMessage, error);
  }

  static async makeRequest(promise, errorContext) {
    try {
      const response = await promise;
      return this.processResponse(response);
    } catch (error) {
      if (error.response) {
        this.handleError(
          error.response.status,
          error.response.data?.message,
          error.response.data?.error
        );
      } else {
        toast.error(`${errorContext}: ${error.message}`);
        throw new ApiError(ResponseStatus.ERROR, error.message);
      }
    }
  }
}

// Custom error class for API errors
class ApiError extends Error {
  constructor(type, message, details = null) {
    super(message);
    this.type = type;
    this.details = details;
    this.name = 'ApiError';
  }
} 