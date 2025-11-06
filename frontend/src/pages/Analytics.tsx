import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import TimeSeriesChart from '../components/charts/TimeSeriesChart';
import { useRealtimeSensors } from '../hooks/useRealtimeSensors';

// Mock data for analytics
const mockScatterData = Array.from({ length: 50 }, (_, i) => ({
  pressure: 60 + Math.random() * 20,
  flow: 100 + Math.random() * 40,
  leak: Math.random() > 0.8 ? 1 : 0,
}));

const mockConfidenceData = [
  { range: '0-20%', count: 5 },
  { range: '20-40%', count: 12 },
  { range: '40-60%', count: 18 },
  { range: '60-80%', count: 25 },
  { range: '80-100%', count: 15 },
];

const mockTemporalData = [
  { time: 'Mon', leaks: 3 },
  { time: 'Tue', leaks: 5 },
  { time: 'Wed', leaks: 2 },
  { time: 'Thu', leaks: 7 },
  { time: 'Fri', leaks: 4 },
  { time: 'Sat', leaks: 3 },
  { time: 'Sun', leaks: 2 },
];

const Analytics: React.FC = () => {
  const { sensors } = useRealtimeSensors();

  const scatterData = sensors.length > 0
    ? sensors.map((s) => ({
        pressure: s.pressure,
        flow: s.flow,
        leak: s.leak_probability > 0.7 ? 1 : 0,
      }))
    : mockScatterData;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1565C0', mb: 1 }}>
            Analytics & Insights
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Detailed analysis of sensor data and leak patterns
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Pressure vs Flow Scatter */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1565C0' }}>
                Pressure vs Flow Analysis
              </Typography>
              <Box sx={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      type="number"
                      dataKey="pressure"
                      name="Pressure"
                      unit=" PSI"
                      stroke="#666"
                    />
                    <YAxis
                      type="number"
                      dataKey="flow"
                      name="Flow"
                      unit=" L/min"
                      stroke="#666"
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter
                      name="No Leak"
                      data={scatterData.filter((d) => d.leak === 0)}
                      fill="#42A5F5"
                    />
                    <Scatter
                      name="Leak Detected"
                      data={scatterData.filter((d) => d.leak === 1)}
                      fill="#E57373"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Confidence Distribution */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1565C0' }}>
                Confidence Distribution
              </Typography>
              <Box sx={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={mockConfidenceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="range" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                      }}
                    />
                    <Bar dataKey="count" fill="#1565C0" name="Predictions Count" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Temporal Trends */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1565C0' }}>
                Weekly Leak Detection Trends
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={mockTemporalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="time" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                      }}
                    />
                    <Bar dataKey="leaks" fill="#E57373" name="Leaks Detected" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics;
