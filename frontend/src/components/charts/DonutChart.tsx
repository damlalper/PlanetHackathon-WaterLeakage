import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface DonutChartProps {
  data: Array<{ name: string; value: number }>;
  title?: string;
  colors?: string[];
}

const DEFAULT_COLORS = ['#1565C0', '#42A5F5', '#81C784', '#FFB74D', '#E57373'];

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title = 'Distribution',
  colors = DEFAULT_COLORS,
}) => {
  return (
    <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1565C0' }}>
          {title}
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DonutChart;
