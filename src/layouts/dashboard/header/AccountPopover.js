import { useSnackbar } from 'notistack';
import { useRef, useState, useMemo, useEffect } from 'react';
// @mui
import { Box, Divider, MenuItem, Typography, Stack, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// components
import { Link as RouterLink } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import { useUiContext } from 'src/contexts/UiContext';
import { decodeToken } from '../../../utils/jwt';
import { apiService } from 'src/api/api';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: '#',
  },
  {
    label: 'Settings',
    linkTo: '#',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const UiContext = useUiContext();
  const anchorRef = useRef(null);
  const { logout } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { enqueueSnackbar } = useSnackbar();

  const uiProps = useMemo(() => {
    return {
      profile: UiContext.profile,
      setProfile: UiContext.setProfile,
      setProfileBase: UiContext.setProfileBase
    };
  }, [UiContext]);


  const handleLogout = async () => {
    try {
      await logout?.();
      navigate('/', { replace: true });

      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Гарах боломжгүй!', { variant: 'error' });
    }
  };
  useEffect(() => {
    const user = decodeToken(window.localStorage.getItem('accessToken'));
    uiProps.setProfile(user ? user : {});
  }, [])

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {uiProps && (
        <>
          <IconButtonAnimate
            ref={anchorRef}
            onClick={handleOpen}
            sx={{
              padding: 0,
              width: 150,
              height: 44
            }}
          >
            <Avatar src='/logo/logo1.svg' alt="Unitel" />
            <Box sx={{ my: 0.5, px: 1.5 }}>
              <Typography variant="subtitle1" style={{ fontSize: '13px' }} noWrap>
                {uiProps.profile?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} style={{ fontSize: '13px', textAlignLast: 'left' }} noWrap>
                {uiProps.profile?.azp}
              </Typography>
            </Box>
          </IconButtonAnimate>

          <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{ width: 220 }}>
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle1" noWrap>
                {uiProps.profile?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {uiProps.profile?.azp}
              </Typography>
            </Box>

            <Divider />
            <Stack spacing={0.5} sx={{ p: 1 }}>
              {MENU_OPTIONS.map((option) => (
                <MenuItem
                  key={option.label}
                  to={option.linkTo}
                  component={RouterLink}
                  onClick={handleClose}
                  sx={{ typography: 'body2', py: 1, px: 2, borderRadius: 1 }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Stack>
            <Divider />

            <MenuItem onClick={handleLogout} sx={{ typography: 'body2', py: 1, px: 2, borderRadius: 1, m: 1 }}>Гарах</MenuItem>
          </MenuPopover>
        </>
      )}
    </>

  );
}
