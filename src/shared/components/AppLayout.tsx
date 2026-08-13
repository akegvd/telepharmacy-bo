"use client";

import { useState } from "react";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 72;

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [{ label: "Dashboard", href: "/", icon: <DashboardIcon /> }];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const drawerWidth = collapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Telepharmacy Back Office
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flex: 1, position: "relative" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: "nowrap",
            transition: (t) =>
              t.transitions.create("width", { duration: t.transitions.duration.shortest }),
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              overflowX: "hidden",
              transition: (t) =>
                t.transitions.create("width", { duration: t.transitions.duration.shortest }),
            },
          }}
        >
          <Toolbar />
          <List component="nav" aria-label="Main navigation" sx={{ pt: 1 }}>
            {NAV_ITEMS.map((item) => (
              <Tooltip key={item.href} title={collapsed ? item.label : ""} placement="right">
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={pathname === item.href}
                  sx={{ justifyContent: collapsed ? "center" : "flex-start", px: 2.5 }}
                >
                  <ListItemIcon
                    sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: "center" }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={item.label} />}
                </ListItemButton>
              </Tooltip>
            ))}
          </List>
        </Drawer>

        <IconButton
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          sx={{
            position: "fixed",
            top: 76,
            left: drawerWidth - 15,
            width: 30,
            height: 30,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: 1,
            zIndex: (t) => t.zIndex.drawer + 2,
            transition: (t) =>
              t.transitions.create("left", { duration: t.transitions.duration.shortest }),
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
        </IconButton>

        <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
          <Toolbar />
          {children}
        </Box>
      </Box>
    </Box>
  );
}
