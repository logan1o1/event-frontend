export const API_BASE_URL = 'https://event-backend-rails.onrender.com';

export const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const getHeaders = () => ({
  'Content-Type': 'application/json'
});
