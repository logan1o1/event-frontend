export const API_BASE_URL = 'http://127.0.0.1:3000';

export const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const getHeaders = () => ({
  'Content-Type': 'application/json'
});
