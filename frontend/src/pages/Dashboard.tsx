import React, { useState, useEffect } from 'react';
import { Box, Grid, Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import {
  WaterDrop,
  Speed,
  Warning,
  TrendingDown,
} from '@mui/icons-material';
import KpiCard from '../components/kpi/KpiCard';
import TimeSeriesChart from '../components/charts/TimeSeriesChart';
import DonutChart from '../components/charts/DonutChart';
import { useRealtimeSensors } from '../hooks/useRealtimeSensors';
import { calculateWaterSavings, calculateCarbonReduction } from '../utils/helpers';

// Mock data for charts
const mockTimeSeriesData = [
  { time: '00:00', pressure: 65, flow: 120 },
  { time: '04:00', pressure: 68, flow: 115 },
  { time: '08:00', pressure: 72, flow: 125 },
  { time: '12:00', pressure: 70, flow: 118 },
  { time: '16:00', pressure: 66, flow: 122 },
  { time: '20:00', pressure: 64, flow: 116 },
];

const Dashboard: React.FC = () => {
  const { sensors, loading } = useRealtimeSensors();
  const [timeRange, setTimeRange] = useState<'hour' | 'day' | 'month'>('day');

  const leaksDetected = sensors.filter((s) => s.leak_probability > 0.7).length;
  const totalSensors = sensors.length || 150;
  const avgPressure = sensors.length > 0
    ? sensors.reduce((sum, s) => sum + s.pressure, 0) / sensors.length
    : 68.5;
  const waterSaved = calculateWaterSavings(leaksDetected);
  const carbonReduced = calculateCarbonReduction(waterSaved);

  const statusData = [
    { name: 'Normal', value: totalSensors - leaksDetected },
    { name: 'Leak Detected', value: leaksDetected },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1565C0', mb: 1 }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time water leak detection and monitoring system
          </Typography>
        </Box>
      </motion.div>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Total Sensors"
            value={totalSensors}
            subtitle="Active monitoring points"
            icon={<Speed fontSize="large" />}
            color="#1565C0"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Leaks Detected"
            value={leaksDetected}
            subtitle="Requiring attention"
            icon={<Warning fontSize="large" />}
            color="#E57373"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Avg Pressure"
            value={`${avgPressure.toFixed(1)} PSI`}
            subtitle="System-wide average"
            icon={<Speed fontSize="large" />}
            color="#42A5F5"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Water Saved"
            value={`${(waterSaved / 1000).toFixed(1)}k L`}
            subtitle={`${carbonReduced.toFixed(1)} kg CO₂ reduced`}
            icon={<TrendingDown fontSize="large" />}
            color="#81C784"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            {(['hour', 'day', 'month'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setTimeRange(range)}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </Box>
          <TimeSeriesChart data={mockTimeSeriesData} title={`Sensor Data - ${timeRange}`} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <DonutChart data={statusData} title="System Status" colors={['#42A5F5', '#E57373']} />
        </Grid>
      </Grid>

      {/* Animated Background */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '150px',
          zIndex: -1,
          overflow: 'hidden',
          opacity: 0.1,
        }}
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <WaterDrop sx={{ fontSize: 200, color: '#1565C0' }} />
        </motion.div>
      </Box>
    </Container>
  );
};

export default Dashboard;
