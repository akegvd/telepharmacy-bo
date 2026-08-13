'use client';

import { AppBar, Box, Toolbar, Typography } from '@mui/material';

import { Sidebar } from './Sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Telepharmacy Back Office
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flex: 1, position: 'relative' }}>
        <Sidebar />

        <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
    </Box>
  );
}
