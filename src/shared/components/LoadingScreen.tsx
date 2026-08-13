import { alpha, Box, Stack, Typography } from '@mui/material';

import { LoadingSpinner } from './LoadingSpinner';

export function LoadingScreen() {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: (theme) => theme.zIndex.modal + 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: (theme) => alpha(theme.palette.common.white, 0.72),
      }}
    >
      <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
        <LoadingSpinner size={40} />
        <Typography variant="body2" color="text.secondary">
          Loading…
        </Typography>
      </Stack>
    </Box>
  );
}
