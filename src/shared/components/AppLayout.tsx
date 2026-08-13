'use client';

import { AppBar, Box, styled, Toolbar, Typography } from '@mui/material';

import { Sidebar } from './Sidebar';

interface IAppLayoutProps {
  children: React.ReactNode;
}

const Root = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
});

const HeaderBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.background.paper,
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
}));

const Body = styled(Box)({
  display: 'flex',
  flex: 1,
  position: 'relative',
});

const Main = styled('main')({
  flexGrow: 1,
  minWidth: 0,
});

export const AppLayout = ({ children }: IAppLayoutProps) => {
  return (
    <Root>
      <HeaderBar position="fixed" color="inherit" elevation={0}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Telepharmacy Back Office
          </Typography>
        </Toolbar>
      </HeaderBar>

      <Body>
        <Sidebar />

        <Main>
          <Toolbar />
          {children}
        </Main>
      </Body>
    </Root>
  );
};
