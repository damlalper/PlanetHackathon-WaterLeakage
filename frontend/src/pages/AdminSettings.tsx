import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Slider,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Save, Notifications } from '@mui/icons-material';
import toast from 'react-hot-toast';

const AdminSettings: React.FC = () => {
  const [threshold, setThreshold] = useState(0.7);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:8000');
  const [refreshInterval, setRefreshInterval] = useState(30);

  const handleSaveSettings = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('leakThreshold', threshold.toString());
    localStorage.setItem('apiEndpoint', apiEndpoint);
    localStorage.setItem('refreshInterval', refreshInterval.toString());
    localStorage.setItem('emailNotifications', emailNotifications.toString());
    localStorage.setItem('smsNotifications', smsNotifications.toString());
    localStorage.setItem('pushNotifications', pushNotifications.toString());

    toast.success('Settings saved successfully!');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1565C0', mb: 1 }}>
            Admin & Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure system parameters and notification preferences
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Detection Settings */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1565C0' }}>
                Detection Settings
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" gutterBottom>
                  Leak Detection Threshold: {(threshold * 100).toFixed(0)}%
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  Predictions above this threshold will trigger leak alerts
                </Typography>
                <Slider
                  value={threshold}
                  onChange={(_, value) => setThreshold(value as number)}
                  min={0}
                  max={1}
                  step={0.05}
                  marks={[
                    { value: 0.5, label: '50%' },
                    { value: 0.7, label: '70%' },
                    { value: 0.9, label: '90%' },
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                />
              </Box>

              <Box>
                <Typography variant="body2" gutterBottom>
                  Data Refresh Interval: {refreshInterval} seconds
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  How often to fetch new sensor data
                </Typography>
                <Slider
                  value={refreshInterval}
                  onChange={(_, value) => setRefreshInterval(value as number)}
                  min={5}
                  max={120}
                  step={5}
                  marks={[
                    { value: 10, label: '10s' },
                    { value: 30, label: '30s' },
                    { value: 60, label: '60s' },
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}s`}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1565C0' }}>
                Notification Settings
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={smsNotifications}
                      onChange={(e) => setSmsNotifications(e.target.checked)}
                    />
                  }
                  label="SMS Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                    />
                  }
                  label="Push Notifications"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* API Configuration */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1565C0' }}>
                API Configuration
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <TextField
                fullWidth
                label="API Endpoint"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                helperText="Base URL for the prediction API"
                sx={{ mb: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" color="secondary">
              Reset to Defaults
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminSettings;
