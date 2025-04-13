import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppsIcon from '@mui/icons-material/Apps';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ContentIcon from '@mui/icons-material/Article';
import LogoutIcon from '@mui/icons-material/Logout';
import TerminalIcon from '@mui/icons-material/Terminal';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const authContext = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    console.log('Logging out...');
    authContext.logout();
    navigate('/');
  };

  const menuItems = [
    { key: 'dashboard', text: '', icon: <AppsIcon />, action: () => navigate('/dashboard') },
    { key: 'automation', text: '', icon: <WidgetsIcon />, action: () => navigate('/automation') },
    { key: 'editor', text: '', icon: <ContentIcon />, action: () => navigate('/editor') },
    { key: 'terminal', text: '', icon: <TerminalIcon />, action: () => navigate('/terminal') },
    { key: 'logout', text: '', icon: <LogoutIcon />, action: handleLogout },
  ];

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {/* Drawer with dynamic width */}
      <Drawer
        variant="permanent"
        sx={{
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {

            minWidth: 60,

            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',


          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                onClick={item.action}
                sx={{
                  justifyContent: 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    justifyContent: 'center',
                    minWidth: 'auto',
                    marginTop: '5px',
                    marginBottom: '10px',

                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Content Area */}
      <Box
        component="main"
        sx={() => {

          return {
            flexGrow: 1,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: 'white',
            overflow: 'auto',
            marginLeft: '60px', // Adjust this based on the width of the drawer

          };
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;