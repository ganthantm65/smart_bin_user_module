import * as SecureStore from 'expo-secure-store';


const BASE_URL = 'http://10.135.215.1:8000/api';

export const customFetch = async (endpoint, options = {}) => {
  const token = await SecureStore.getItemAsync('userToken');
  const headers = { ...options.headers };

  // Auto-set JSON content type unless we are uploading an image (FormData)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Auto-attach the secure lock key
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch (e) {}
    throw new Error(errorMessage);
  }

  return response.json();
};

export default customFetch;