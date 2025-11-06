import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Slider, FormControlLabel, Switch } from '@mui/material';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import SensorMarker from '../components/map/SensorMarker';
import { useRealtimeSensors } from '../hooks/useRealtimeSensors';
import toast from 'react-hot-toast';

const mapContainerStyle = {
  width: '100%',
  height: '70vh',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

const MapView: React.FC = () => {
  const { sensors, loading } = useRealtimeSensors();
  const [threshold, setThreshold] = useState(0.7);
  const [showOnlyLeaks, setShowOnlyLeaks] = useState(false);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const filteredSensors = showOnlyLeaks
    ? sensors.filter((s) => s.leak_probability > threshold)
    : sensors;

  const handleMarkerClick = (sensor: any) => {
    if (sensor.leak_probability > threshold) {
      toast.error(
        `Leak Alert! Sensor ${sensor.id} - ${(sensor.leak_probability * 100).toFixed(1)}% probability`,
        {
          duration: 4000,
          position: 'bottom-right',
        }
      );
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1565C0', mb: 1 }}>
            Map Visualization
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time sensor locations and leak detection
          </Typography>
        </Box>
      </motion.div>

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="body2" gutterBottom>
              Leak Threshold: {(threshold * 100).toFixed(0)}%
            </Typography>
            <Slider
              value={threshold}
              onChange={(_, value) => setThreshold(value as number)}
              min={0}
              max={1}
              step={0.05}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
            />
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyLeaks}
                onChange={(e) => setShowOnlyLeaks(e.target.checked)}
              />
            }
            label="Show Only Leaks"
          />
          <Typography variant="body2" color="text.secondary">
            Displaying {filteredSensors.length} / {sensors.length} sensors
          </Typography>
        </Box>
      </Paper>

      {/* Map */}
      <Paper sx={{ overflow: 'hidden', borderRadius: 2 }}>
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={sensors.length > 0 ? { lat: sensors[0].lat, lng: sensors[0].lng } : defaultCenter}
            zoom={12}
            options={{
              styles: [
                {
                  featureType: 'water',
                  elementType: 'geometry',
                  stylers: [{ color: '#e3f2fd' }],
                },
              ],
            }}
          >
            {filteredSensors.map((sensor) => (
              <SensorMarker
                key={sensor.id}
                sensor={sensor}
                threshold={threshold}
                onMarkerClick={handleMarkerClick}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </Paper>

      {loading && (
        <Typography variant="body2" align="center" sx={{ mt: 2 }} color="text.secondary">
          Loading sensor data...
        </Typography>
      )}
    </Container>
  );
};

export default MapView;
