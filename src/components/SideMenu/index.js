import React, { useMemo, useState } from 'react';
import {
  Drawer,
  IconButton,
  Box,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';

import './style.scss';

const SideMenu = ({
  userName,
  userTypeLabel,
  onEditProfile,
  onLogout,
}) => {
  const [open, setOpen] = useState(false);

  const initials = useMemo(() => {
    if (!userName) return 'U';
    const parts = userName.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [userName]);

  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="side-menu-trigger">
        <IconButton
          className="side-menu-button"
          aria-label="Abrir menu"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      </div>

      <Drawer
        anchor="left"
        open={open}
        onClose={handleClose}
        PaperProps={{ className: 'side-menu-paper' }}
      >
        <Box className="side-menu-content" role="presentation">
          <div className="side-menu-header">
            <Avatar className="side-menu-avatar">{initials}</Avatar>
            <div className="side-menu-user">
              <Typography variant="subtitle1" className="side-menu-name">
                {userName || 'Usuario'}
              </Typography>
              {userTypeLabel && (
                <Typography variant="caption" className="side-menu-role">
                  {userTypeLabel}
                </Typography>
              )}
            </div>
          </div>

          <Divider className="side-menu-divider" />

          <List className="side-menu-list">
            <ListItemButton
              className="side-menu-item"
              onClick={() => {
                handleClose();
                onEditProfile();
              }}
            >
              <ListItemIcon className="side-menu-item-icon">
                <ManageAccountsIcon />
              </ListItemIcon>
              <ListItemText primary="Alterar dados" />
            </ListItemButton>
            <ListItemButton
              className="side-menu-item"
              onClick={() => {
                handleClose();
                onLogout();
              }}
            >
              <ListItemIcon className="side-menu-item-icon">
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default SideMenu;
