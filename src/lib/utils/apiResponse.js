// Define response types
export const ResponseStatus = {
  SUCCESS: 'success',
  ERROR: 'error',
  AUTH_ERROR: 'auth_error',
  VALIDATION_ERROR: 'validation_error',
  NOT_FOUND: 'not_found',
  SERVER_ERROR: 'server_error'
};

// Error mapping for user-friendly messages
export const ErrorMessages = {
  [ResponseStatus.AUTH_ERROR]: 'Please login to continue',
  [ResponseStatus.VALIDATION_ERROR]: 'Please check your input',
  [ResponseStatus.NOT_FOUND]: 'Resource not found',
  [ResponseStatus.SERVER_ERROR]: 'Something went wrong',
  DEFAULT: 'An unexpected error occurred'
};

// HTTP Status codes mapping
export const StatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500
}; 