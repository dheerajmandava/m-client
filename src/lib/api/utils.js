export const handleApiError = (error, defaultMessage) => {
  if (error.message === 'Network Error') {
    return {
      success: false,
      message: 'Unable to connect to server. Please check your internet connection.',
      error: {
        code: 'NETWORK_ERROR',
        details: error.message
      }
    };
  }

  return {
    success: false,
    message: error.response?.data?.message || defaultMessage,
    error: error.response?.data?.error || error.message
  };
}; 