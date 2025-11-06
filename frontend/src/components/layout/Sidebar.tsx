import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Map as MapIcon,
  Analytics as AnalyticsIcon,
  Science as ScienceIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Map View', icon: <MapIcon />, path: '/map' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Model Insights', icon: <ScienceIcon />, path: '/model' },
  { text: 'Admin & Settings', icon: <SettingsIcon />, path: '/admin' },
];

const Sidebar: React.FC<SidebarProps> = ({ open = true, onClose }) => {
  const location = useLocation();

  const drawer = (
    <>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" noWrap component="div" sx={{ color: '#1565C0', fontWeight: 600 }}>
            WaterWatch
          </Typography>
        </Box>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(21, 101, 192, 0.08)',
                  borderRight: '3px solid #1565C0',
                },
                '&:hover': {
                  backgroundColor: 'rgba(21, 101, 192, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#1565C0' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;
