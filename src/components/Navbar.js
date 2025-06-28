import React from 'react';
import { AppBar, Toolbar, Typography, Button, Stack, IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = ({ toggleTheme, currentMode }) => {
  return (
    <AppBar position="sticky" color="primary"> {/* 👈 Sticky navbar */}
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">🔗 URL Shortener</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          <Button color="inherit" component={RouterLink} to="/stats">Stats</Button>
          <Button color="inherit" component={RouterLink} to="/logs">Logs</Button>
          <Tooltip title={`Switch to ${currentMode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton color="inherit" onClick={toggleTheme}>
              {currentMode === 'light' ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
