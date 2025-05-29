import React from 'react';
import { Box, Paper, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import AppsIcon from '@mui/icons-material/Apps';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ContentIcon from '@mui/icons-material/Article';
import LogoutIcon from '@mui/icons-material/Logout';
import TerminalIcon from '@mui/icons-material/Terminal';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const authContext = useAuth();

  const handleLogout = () => {
    authContext.logout();
    navigate('/');
  };

  const menuItems = [
    { key: 'dashboard', icon: <AppsIcon />, action: () => navigate('/dashboard') },
    { key: 'automation', icon: <WidgetsIcon />, action: () => navigate('/automation') },
    { key: 'editor', icon: <ContentIcon />, action: () => navigate('/editor') },
    { key: 'terminal', icon: <TerminalIcon />, action: () => navigate('/terminal') },
    { key: 'logout', icon: <LogoutIcon />, action: handleLogout },
  ];

  return (
    <Box sx={{ height: '100%', pb: 8, backgroundColor: 'white' }}>
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: 'calc(100vh - 64px)', // Subtract navbar height
          backgroundColor: 'white',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation */}
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          zIndex: 1200,
        }}
      >
        <List sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', p: 0 }}>
          {menuItems.map((item) => (
            <ListItem key={item.key} disablePadding sx={{ flex: 1, justifyContent: 'center' }}>
              <ListItemButton
                onClick={item.action}
                sx={{ justifyContent: 'center', minHeight: 56 }}
              >
                <ListItemIcon sx={{ justifyContent: 'center', minWidth: 'auto' }}>
                  {item.icon}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Layout;