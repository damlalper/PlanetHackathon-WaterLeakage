import axios from 'axios';

// Configure base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface PredictionRequest {
  pressure: number;
  flow: number;
  temperature: number;
  location_id?: string;
}

export interface PredictionResponse {
  leak_probability: number;
  prediction: 0 | 1;
  confidence: number;
  timestamp: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: number[][];
}

// API endpoints
export const predictLeak = async (data: PredictionRequest): Promise<PredictionResponse> => {
  const response = await api.post<PredictionResponse>('/predict', data);
  return response.data;
};

export const getModelMetrics = async (): Promise<ModelMetrics> => {
  const response = await api.get<ModelMetrics>('/model/metrics');
  return response.data;
};

export const retrainModel = async (): Promise<{ status: string; message: string }> => {
  const response = await api.post('/model/retrain');
  return response.data;
};

export default api;
