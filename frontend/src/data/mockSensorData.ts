import { SensorData } from '../components/map/SensorMarker';

// Mock sensor data for testing without backend
export const mockSensors: SensorData[] = [
  {
    id: 'S001',
    lat: 40.7580,
    lng: -73.9855,
    pressure: 68.5,
    flow: 125.3,
    temperature: 22.5,
    leak_probability: 0.15,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'S002',
    lat: 40.7589,
    lng: -73.9851,
    pressure: 52.3,
    flow: 89.2,
    temperature: 21.8,
    leak_probability: 0.85,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'S003',
    lat: 40.7571,
    lng: -73.9876,
    pressure: 70.2,
    flow: 130.5,
    temperature: 23.1,
    leak_probability: 0.22,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'S004',
    lat: 40.7595,
    lng: -73.9842,
    pressure: 45.8,
    flow: 75.4,
    temperature: 20.5,
    leak_probability: 0.92,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'S005',
    lat: 40.7565,
    lng: -73.9868,
    pressure: 67.9,
    flow: 122.8,
    temperature: 22.9,
    leak_probability: 0.18,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'S006',
    lat: 40.7602,
    lng: -73.9838,
    pressure: 69.4,
    flow: 128.1,
    temperature: 23.5,
    leak_probability: 0.12,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'S007',
    lat: 40.7558,
    lng: -73.9882,
    pressure: 48.7,
    flow: 82.3,
    temperature: 21.2,
    leak_probability: 0.78,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'S008',
    lat: 40.7612,
    lng: -73.9825,
    pressure: 71.2,
    flow: 135.6,
    temperature: 24.1,
    leak_probability: 0.08,
    timestamp: new Date().toISOString(),
  },
];

// Function to simulate real-time updates
export const generateRandomSensorUpdate = (sensor: SensorData): SensorData => {
  return {
    ...sensor,
    pressure: sensor.pressure + (Math.random() - 0.5) * 5,
    flow: sensor.flow + (Math.random() - 0.5) * 10,
    temperature: sensor.temperature + (Math.random() - 0.5) * 2,
    leak_probability: Math.max(0, Math.min(1, sensor.leak_probability + (Math.random() - 0.5) * 0.1)),
    timestamp: new Date().toISOString(),
  };
};
