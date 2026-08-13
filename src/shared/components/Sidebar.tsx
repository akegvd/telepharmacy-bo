"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import NextLink from "./NextLink";

const DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 72;

interface INavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: INavItem[] = [{ label: "Dashboard", href: "/", icon: <DashboardIcon /> }];

export function Sidebar() {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [collapsed, setCollapsed] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setCollapsed(isMobile);
    }
  }, [isMobile]);

  const drawerWidth = collapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

  return (
    <>
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
                component={NextLink}
                href={item.href}
                selected={pathname === item.href}
                sx={{ justifyContent: collapsed ? "center" : "flex-start", px: 2.5 }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: "center" }}>
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
    </>
  );
}
