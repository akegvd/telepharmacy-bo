import { alpha, Box, Stack, styled, Typography } from '@mui/material';

import { LoadingSpinner } from './LoadingSpinner';

const Overlay = styled(Box)(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  zIndex: theme.zIndex.modal + 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.common.white, 0.72),
}));

const Content = styled(Stack)({
  alignItems: 'center',
});

export const LoadingScreen = () => {
  return (
    <Overlay>
      <Content spacing={1.5}>
        <LoadingSpinner size={40} />
        <Typography variant="body2" color="text.secondary">
          Loading…
        </Typography>
      </Content>
    </Overlay>
  );
};
