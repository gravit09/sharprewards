import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For iOS Simulator, use localhost. For Android emulator use 10.0.2.2
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }
  return 'http://localhost:3000/api';
};

const API_URL = getApiUrl();

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const api = {
  async register(firstName: string, lastName: string, email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    return handleResponse(res);
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async getProfile() {
    const res = await fetch(`${API_URL}/user/profile`, { headers: await getAuthHeaders() });
    return handleResponse(res);
  },

  async updateProfile(data: { firstName?: string; lastName?: string; phone?: string }) {
    const res = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async addPoints(points: number, title?: string, description?: string) {
    const res = await fetch(`${API_URL}/user/add-points`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ points, title, description }),
    });
    return handleResponse(res);
  },

  async getRewards() {
    const res = await fetch(`${API_URL}/rewards`, { headers: await getAuthHeaders() });
    return handleResponse(res);
  },

  async getMyRewards() {
    const res = await fetch(`${API_URL}/rewards/my-rewards`, { headers: await getAuthHeaders() });
    return handleResponse(res);
  },

  async redeemReward(rewardId: string) {
    const res = await fetch(`${API_URL}/rewards/redeem/${rewardId}`, {
      method: 'POST',
      headers: await getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getTransactions(type?: string) {
    const url = type && type !== 'all' ? `${API_URL}/transactions?type=${type}` : `${API_URL}/transactions`;
    const res = await fetch(url, { headers: await getAuthHeaders() });
    return handleResponse(res);
  },

  async getStats() {
    const res = await fetch(`${API_URL}/transactions/stats`, { headers: await getAuthHeaders() });
    return handleResponse(res);
  },
};
