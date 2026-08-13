'use client';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import NextLink from './NextLink';

const DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 64;

interface INavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface IDrawerWidthProps {
  drawerWidth: number;
}

interface ICollapsedProps {
  collapsed: boolean;
}

const NAV_ITEMS: INavItem[] = [{ label: 'Dashboard', href: '/', icon: <DashboardIcon /> }];

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'drawerWidth',
})<IDrawerWidthProps>(({ theme, drawerWidth }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  transition: theme.transitions.create('width', { duration: theme.transitions.duration.shortest }),
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    overflowX: 'hidden',
    transition: theme.transitions.create('width', { duration: theme.transitions.duration.shortest }),
  },
}));

const NavItemButton = styled(ListItemButton)({
  justifyContent: 'flex-start',
  '&[data-collapsed="true"]': {
    justifyContent: 'center',
  },
}) as typeof ListItemButton;

const NavItemIcon = styled(ListItemIcon, {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<ICollapsedProps>(({ theme, collapsed }) => ({
  minWidth: 0,
  marginRight: collapsed ? 0 : theme.spacing(2),
  justifyContent: 'center',
}));

const CollapseToggle = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'drawerWidth',
})<IDrawerWidthProps>(({ theme, drawerWidth }) => ({
  position: 'fixed',
  top: 76,
  left: drawerWidth - 15,
  width: 30,
  height: 30,
  backgroundColor: theme.palette.background.paper,
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: theme.shadows[1],
  zIndex: theme.zIndex.drawer + 2,
  transition: theme.transitions.create('left', { duration: theme.transitions.duration.shortest }),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const Sidebar = () => {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [collapsed, setCollapsed] = useState(false);
  const userToggled = useRef(false);
  const drawerWidth = collapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

  const handleToggleCollapsed = useCallback(() => {
    userToggled.current = true;
    setCollapsed((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!userToggled.current) {
      setCollapsed(isMobile);
    }
  }, [isMobile]);

  return (
    <>
      <StyledDrawer variant="permanent" drawerWidth={drawerWidth}>
        <Toolbar />
        <List component="nav" aria-label="Main navigation" sx={{ pt: 1 }}>
          {NAV_ITEMS.map((item) => (
            <Tooltip key={item.href} title={collapsed ? item.label : ''} placement="right">
              <NavItemButton
                component={NextLink}
                href={item.href}
                selected={pathname === item.href}
                data-collapsed={collapsed}
                sx={{ px: collapsed ? 1.5 : 2.5 }}
              >
                <NavItemIcon collapsed={collapsed}>{item.icon}</NavItemIcon>
                {!collapsed && <ListItemText primary={item.label} />}
              </NavItemButton>
            </Tooltip>
          ))}
        </List>
      </StyledDrawer>

      <CollapseToggle
        drawerWidth={drawerWidth}
        onClick={handleToggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
      </CollapseToggle>
    </>
  );
};
