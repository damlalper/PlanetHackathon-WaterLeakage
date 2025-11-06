import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { CustomThemeProvider, useThemeMode } from './components/ui/ThemeProvider';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import Analytics from './pages/Analytics';
import ModelInsights from './pages/ModelInsights';
import AdminSettings from './pages/AdminSettings';

const AppContent: React.FC = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <Topbar
          darkMode={mode === 'dark'}
          onToggleDarkMode={toggleTheme}
          notificationCount={3}
        />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 240px)` },
            minHeight: '100vh',
            backgroundColor: 'background.default',
          }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/model" element={<ModelInsights />} />
            <Route path="/admin" element={<AdminSettings />} />
          </Routes>
        </Box>
      </Box>
      <Toaster position="bottom-right" />
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
};

export default App;
