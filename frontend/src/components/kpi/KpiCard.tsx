import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  loading?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = '#1565C0',
  loading = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          height: '100%',
          borderLeft: `4px solid ${color}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease',
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              {loading ? (
                <Skeleton variant="text" width="60%" height={40} />
              ) : (
                <Typography variant="h4" component="div" sx={{ fontWeight: 600, color }}>
                  {value}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            {icon && (
              <Box sx={{ color, opacity: 0.7 }}>
                {icon}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default KpiCard;
