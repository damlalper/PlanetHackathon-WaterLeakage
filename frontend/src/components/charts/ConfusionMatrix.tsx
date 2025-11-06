import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';

interface ConfusionMatrixProps {
  matrix: number[][];
  labels?: string[];
  title?: string;
}

const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({
  matrix,
  labels = ['No Leak', 'Leak'],
  title = 'Confusion Matrix',
}) => {
  const maxValue = Math.max(...matrix.flat());

  const getColor = (value: number) => {
    const intensity = value / maxValue;
    const blue = Math.round(21 + (165 - 21) * intensity);
    const green = Math.round(101 + (245 - 101) * intensity);
    const red = Math.round(192 + (66 - 192) * intensity);
    return `rgb(${red}, ${green}, ${blue})`;
  };

  return (
    <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1565C0' }}>
          {title}
        </Typography>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Predicted
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}></Grid>
            {labels.map((label, idx) => (
              <Grid item xs={4} key={`header-${idx}`}>
                <Typography variant="body2" align="center" sx={{ fontWeight: 500 }}>
                  {label}
                </Typography>
              </Grid>
            ))}
            {matrix.map((row, rowIdx) => (
              <React.Fragment key={`row-${rowIdx}`}>
                {rowIdx === 0 && (
                  <Grid item xs={3}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'flex-end',
                        pr: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 600, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                      >
                        Actual
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {rowIdx === 1 && <Grid item xs={3}></Grid>}
                <Grid item xs={12} container>
                  <Grid item xs={3}>
                    <Typography variant="body2" align="right" sx={{ pr: 2, fontWeight: 500 }}>
                      {labels[rowIdx]}
                    </Typography>
                  </Grid>
                  {row.map((value, colIdx) => (
                    <Grid item xs={4} key={`cell-${rowIdx}-${colIdx}`}>
                      <Box
                        sx={{
                          backgroundColor: getColor(value),
                          color: value > maxValue * 0.5 ? '#fff' : '#000',
                          padding: 3,
                          textAlign: 'center',
                          borderRadius: 1,
                          fontWeight: 600,
                          fontSize: '1.2rem',
                        }}
                      >
                        {value}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ConfusionMatrix;
