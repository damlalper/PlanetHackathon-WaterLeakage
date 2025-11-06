import React from 'react';
import { InfoWindow, Marker } from '@react-google-maps/api';
import { Box, Typography } from '@mui/material';

export interface SensorData {
  id: string;
  lat: number;
  lng: number;
  pressure: number;
  flow: number;
  temperature: number;
  leak_probability: number;
  timestamp: string;
}

interface SensorMarkerProps {
  sensor: SensorData;
  threshold?: number;
  onMarkerClick?: (sensor: SensorData) => void;
}

const SensorMarker: React.FC<SensorMarkerProps> = ({ sensor, threshold = 0.7, onMarkerClick }) => {
  const [showInfo, setShowInfo] = React.useState(false);
  const isLeak = sensor.leak_probability > threshold;

  // Create custom marker icon with SVG
  const markerIcon = React.useMemo(() => {
    const svgMarker = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="12" fill="${isLeak ? '#E57373' : '#42A5F5'}"
                stroke="${isLeak ? '#C62828' : '#1565C0'}" stroke-width="3"/>
        ${isLeak ? '<text x="16" y="20" text-anchor="middle" fill="white" font-size="16" font-weight="bold">!</text>' : ''}
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgMarker)}`,
      scaledSize: typeof window !== 'undefined' && window.google
        ? new window.google.maps.Size(isLeak ? 32 : 24, isLeak ? 32 : 24)
        : undefined,
    };
  }, [isLeak]);

  return (
    <>
      <Marker
        position={{ lat: sensor.lat, lng: sensor.lng }}
        icon={markerIcon}
        onClick={() => {
          setShowInfo(true);
          onMarkerClick?.(sensor);
        }}
      />
      {showInfo && (
        <InfoWindow
          position={{ lat: sensor.lat, lng: sensor.lng }}
          onCloseClick={() => setShowInfo(false)}
        >
          <Box sx={{ p: 1, minWidth: 200 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1565C0', mb: 1 }}>
              Sensor {sensor.id}
            </Typography>
            <Typography variant="body2">
              <strong>Pressure:</strong> {sensor.pressure.toFixed(2)} PSI
            </Typography>
            <Typography variant="body2">
              <strong>Flow:</strong> {sensor.flow.toFixed(2)} L/min
            </Typography>
            <Typography variant="body2">
              <strong>Temperature:</strong> {sensor.temperature.toFixed(1)}°C
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: isLeak ? '#C62828' : '#2E7D32',
                fontWeight: 600,
                mt: 1,
              }}
            >
              <strong>Leak Probability:</strong> {(sensor.leak_probability * 100).toFixed(1)}%
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {new Date(sensor.timestamp).toLocaleString()}
            </Typography>
          </Box>
        </InfoWindow>
      )}
    </>
  );
};

export default SensorMarker;
