import React from 'react';
import { Drawer, Box, Button } from '@mui/material';

const BottomCenteredDrawer = () => {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
  };

  return (
    <div>
      <Button variant="contained" onClick={toggleDrawer(true)}>
        Open Drawer
      </Button>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 'fit-content', // Adjust width to fit content
            margin: '0 auto', // Center horizontally
            borderRadius: '8px', // Optional: Add rounded corners
          },
        }}
      >
        <Box
          sx={{
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <h3>Bottom-Centered Drawer</h3>
          <p>This drawer is centered horizontally at the bottom.</p>
          <Button variant="contained" onClick={toggleDrawer(false)}>
            Close Drawer
          </Button>
        </Box>
      </Drawer>
    </div>
  );
};

export default BottomCenteredDrawer;