import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Refresh } from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import ConfusionMatrix from '../components/charts/ConfusionMatrix';
import KpiCard from '../components/kpi/KpiCard';
import { getModelMetrics, retrainModel } from '../services/api';
import toast from 'react-hot-toast';

// Mock SHAP feature importance data
const mockShapData = [
  { feature: 'Pressure Drop', importance: 0.35 },
  { feature: 'Flow Rate', importance: 0.28 },
  { feature: 'Temperature', importance: 0.15 },
  { feature: 'Time of Day', importance: 0.12 },
  { feature: 'Location', importance: 0.10 },
];

const ModelInsights: React.FC = () => {
  const [metrics, setMetrics] = useState({
    accuracy: 0.92,
    precision: 0.89,
    recall: 0.94,
    f1_score: 0.91,
    confusion_matrix: [[850, 50], [30, 220]],
  });
  const [loading, setLoading] = useState(false);
  const [retraining, setRetraining] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await getModelMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      // Use mock data if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      const response = await retrainModel();
      toast.success(response.message || 'Model retraining initiated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initiate model retraining');
    } finally {
      setRetraining(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#1565C0', mb: 1 }}>
              Model Insights
            </Typography>
            <Typography variant="body1" color="text.secondary">
              XGBoost model performance and feature analysis
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={retraining ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
            onClick={handleRetrain}
            disabled={retraining}
          >
            {retraining ? 'Retraining...' : 'Retrain Model'}
          </Button>
        </Box>
      </motion.div>

      {/* Model Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Accuracy"
            value={`${(metrics.accuracy * 100).toFixed(1)}%`}
            subtitle="Overall correctness"
            color="#1565C0"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Precision"
            value={`${(metrics.precision * 100).toFixed(1)}%`}
            subtitle="Positive prediction accuracy"
            color="#42A5F5"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Recall"
            value={`${(metrics.recall * 100).toFixed(1)}%`}
            subtitle="True positive rate"
            color="#81C784"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="F1 Score"
            value={`${(metrics.f1_score * 100).toFixed(1)}%`}
            subtitle="Harmonic mean"
            color="#FFB74D"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Confusion Matrix */}
        <Grid item xs={12} lg={6}>
          <ConfusionMatrix matrix={metrics.confusion_matrix} labels={['No Leak', 'Leak']} />
        </Grid>

        {/* SHAP Feature Importance */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1565C0' }}>
                SHAP Feature Importance
              </Typography>
              <Box sx={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={mockShapData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis type="number" stroke="#666" />
                    <YAxis dataKey="feature" type="category" stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="importance" fill="#1565C0" name="Importance Score" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Model Information */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1565C0' }}>
                Model Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Algorithm
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    XGBoost Classifier
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Training Data
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    10,000+ samples
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Last Trained
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Deployment
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Vertex AI
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ModelInsights;
