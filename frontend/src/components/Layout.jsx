import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import DashboardIcon from '@mui/icons-material/Dashboard';
import AutomationIcon from '@mui/icons-material/Settings';
import ContentIcon from '@mui/icons-material/Article';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const menuItems = [
  { text: 'Main Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Automation', icon: <AutomationIcon />, path: '/automation' },
  { text: 'Content', icon: <ContentIcon />, path: '/content' },
];

const Layout = ({ children }) => {
  const navigate = useNavigate(); // Initialize navigate
  const authContext = useAuth(); // Access AuthContext
  const location = useLocation();

  const handleLogout = () => {
    console.log('Logging out...');
    authContext.logout(); // Call the logout function from AuthContext
    navigate('/'); // Redirect to the login page
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {/* Left Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* Logout Button */}
        <Box
          sx={{
            marginTop: 'auto',
            padding: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#e0e0e0',
              color: '#000',
              '&:hover': { backgroundColor: '#d6d6d6' },
            }}
            startIcon={<LogoutIcon />}
            fullWidth
            onClick={handleLogout} // Call handleLogout on click
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: 'background.default',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;