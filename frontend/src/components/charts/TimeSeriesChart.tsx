import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface TimeSeriesChartProps {
  data: Array<{ time: string; pressure: number; flow: number }>;
  title?: string;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, title = 'Sensor Data Over Time' }) => {
  return (
    <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1565C0' }}>
          {title}
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              <Legend />
              <Line
                type="monotone"
                dataKey="pressure"
                stroke="#1565C0"
                strokeWidth={2}
                dot={{ fill: '#1565C0' }}
                name="Pressure (PSI)"
              />
              <Line
                type="monotone"
                dataKey="flow"
                stroke="#42A5F5"
                strokeWidth={2}
                dot={{ fill: '#42A5F5' }}
                name="Flow Rate (L/min)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TimeSeriesChart;
